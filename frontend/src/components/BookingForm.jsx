import React, { useState } from 'react';

export default function BookingForm({
  selectedSlot,
  onConfirmBooking,
  isProcessing = false,
  error = '',
}) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [localError, setLocalError] = useState('');

  if (!selectedSlot) {
    return (
      <div className="booking-form-placeholder">
        <p>Please select an available parking slot from the layout above to proceed with booking.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanVehicle = vehicleNumber.trim().toUpperCase();
    if (!cleanVehicle) {
      setLocalError('Please enter a valid vehicle number (e.g. MH04AB1234).');
      return;
    }
    setLocalError('');
    onConfirmBooking(cleanVehicle);
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3 className="booking-title">Book Parking Slot</h3>
        <p className="booking-subtitle">Enter vehicle information to reserve your spot.</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label className="form-label" htmlFor="selected-slot-display">
            Selected Slot
          </label>
          <div id="selected-slot-display" className="selected-slot-badge">
            {selectedSlot}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="vehicleNumberInput">
            Vehicle Number
          </label>
          <input
            id="vehicleNumberInput"
            type="text"
            className="form-input"
            placeholder="e.g. MH04AB1234"
            value={vehicleNumber}
            onChange={(e) => {
              setVehicleNumber(e.target.value.toUpperCase());
              if (localError) setLocalError('');
            }}
            disabled={isProcessing}
            autoFocus
            maxLength={15}
          />
        </div>

        {(localError || error) && (
          <div className="form-error-msg" role="alert">
            {localError || error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary btn-confirm"
            disabled={isProcessing || !vehicleNumber.trim()}
          >
            {isProcessing ? 'Processing booking...' : 'Confirm Parking'}
          </button>
        </div>
      </form>
    </div>
  );
}
