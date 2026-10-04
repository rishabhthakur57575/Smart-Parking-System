import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingLegend from '../components/ParkingLegend';
import ParkingLayout from '../components/ParkingLayout';
import BookingForm from '../components/BookingForm';
import { parkingService } from '../services/api';

export default function ParkingLayoutPage() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchSlots = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await parkingService.getAllSlots();
      if (Array.isArray(data)) {
        setSlots(data);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
      setFetchError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSelectSlot = (slotNumber) => {
    // If user clicks the currently selected slot, keep it or toggle
    if (selectedSlot === slotNumber) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slotNumber);
      setBookingError('');
    }
  };

  const handleConfirmBooking = async (vehicleNumber) => {
    if (!selectedSlot) return;

    setIsProcessing(true);
    setBookingError('');

    try {
      const slotObj = slots.find((s) => s.slotNumber === selectedSlot);
      const slotId = slotObj ? slotObj.id : selectedSlot;

      const result = await parkingService.bookSlot(slotId, vehicleNumber);

      if (result && result.token) {
        navigate('/confirmation', {
          state: {
            token: result.token,
            slotNumber: result.slotNumber || selectedSlot,
            vehicleNumber: result.vehicleNumber || vehicleNumber,
            entryTime: result.entryTime || '12:35 PM',
          },
        });
      } else {
        throw new Error('Could not generate booking confirmation.');
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(err.message || 'Slot unavailable or already occupied.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Parking Layout</h1>
        <p className="page-subtitle">Select an available parking slot.</p>
      </div>

      {fetchError && (
        <div className="notification-banner error">
          {fetchError}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p>Loading parking slots...</p>
        </div>
      ) : (
        <>
          {/* Legend above layout */}
          <div className="layout-legend-bar">
            <ParkingLegend />
          </div>

          {/* Physical 50 slots grid */}
          <ParkingLayout
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
          />

          {/* Simple Booking Section underneath layout */}
          <div className="booking-anchor-section">
            <BookingForm
              selectedSlot={selectedSlot}
              onConfirmBooking={handleConfirmBooking}
              isProcessing={isProcessing}
              error={bookingError}
            />
          </div>
        </>
      )}
    </div>
  );
}
