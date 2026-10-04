import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../components/ConfirmationDialog';
import StatusBadge from '../components/StatusBadge';
import { parkingService } from '../services/api';

export default function Admin() {
  const [reservedSlots, setReservedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetSlot, setTargetSlot] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const fetchReservedSlots = async () => {
    setLoading(true);
    try {
      const allSlots = await parkingService.getAllSlots();
      if (Array.isArray(allSlots)) {
        const reservedOnly = allSlots.filter((s) => s.status === 'RESERVED');
        setReservedSlots(reservedOnly);
      }
    } catch (err) {
      console.error('Failed to load slots in admin:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to retrieve parking slots from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservedSlots();
  }, []);

  const handleOpenDialog = (slot) => {
    setTargetSlot(slot);
    setIsDialogOpen(true);
    setStatusMessage({ type: '', text: '' });
  };

  const handleCloseDialog = () => {
    if (isProcessing) return;
    setIsDialogOpen(false);
    setTargetSlot(null);
  };

  const handleConfirmFree = async () => {
    if (!targetSlot) return;

    setIsProcessing(true);
    try {
      await parkingService.freeReservedSlot(targetSlot.id || targetSlot.slotNumber);
      setStatusMessage({
        type: 'success',
        text: `Slot ${targetSlot.slotNumber} has been successfully freed and is now AVAILABLE.`,
      });
      setIsDialogOpen(false);
      setTargetSlot(null);
      await fetchReservedSlots();
    } catch (err) {
      console.error('Error freeing slot:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Could not free the selected slot.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container narrow-container">
      <div className="page-header">
        <h1 className="page-title">Reserved Parking Slots</h1>
        <p className="page-subtitle">
          Staff management interface to release reserved slots for general availability.
        </p>
      </div>

      {statusMessage.text && (
        <div className={`notification-banner ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p>Loading reserved slots...</p>
        </div>
      ) : reservedSlots.length === 0 ? (
        <div className="content-card text-center py-5">
          <p className="text-muted">There are currently no reserved parking slots.</p>
        </div>
      ) : (
        <div className="admin-slots-list">
          {reservedSlots.map((slot) => (
            <div key={slot.id || slot.slotNumber} className="admin-slot-row">
              <div className="admin-slot-info">
                <span className="admin-slot-number">{slot.slotNumber}</span>
                <StatusBadge status="RESERVED" />
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleOpenDialog(slot)}
              >
                Free Slot
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Free Reserved Slot"
        message={
          targetSlot
            ? `Are you sure you want to make ${targetSlot.slotNumber} available?`
            : ''
        }
        onConfirm={handleConfirmFree}
        onCancel={handleCloseDialog}
        confirmText="Confirm"
        cancelText="Cancel"
        isProcessing={isProcessing}
      />
    </div>
  );
}
