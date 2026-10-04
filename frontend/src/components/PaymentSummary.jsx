import React from 'react';

export default function PaymentSummary({ details }) {
  if (!details) return null;

  const {
    vehicleNumber,
    slotNumber,
    entryTime,
    currentTime,
    duration,
    rate,
    totalAmount,
    token,
  } = details;

  return (
    <div className="payment-summary-card">
      <div className="summary-rows">
        {token && (
          <div className="summary-row">
            <span className="summary-label">Parking Token</span>
            <span className="summary-value token-highlight">{token}</span>
          </div>
        )}
        <div className="summary-row">
          <span className="summary-label">Vehicle Number</span>
          <span className="summary-value">{vehicleNumber}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Parking Slot</span>
          <span className="summary-value font-semibold">{slotNumber}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Entry Time</span>
          <span className="summary-value">{entryTime}</span>
        </div>
        {currentTime && (
          <div className="summary-row">
            <span className="summary-label">Current Time</span>
            <span className="summary-value">{currentTime}</span>
          </div>
        )}
        <div className="summary-row">
          <span className="summary-label">Duration</span>
          <span className="summary-value">{duration}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Parking Rate</span>
          <span className="summary-value">{rate || '₹30/hour'}</span>
        </div>
      </div>

      <div className="total-amount-box">
        <span className="total-amount-label">Total Amount</span>
        <span className="total-amount-val">₹{totalAmount}</span>
      </div>
    </div>
  );
}
