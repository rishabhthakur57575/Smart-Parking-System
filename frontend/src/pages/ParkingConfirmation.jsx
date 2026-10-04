import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import TokenCard from '../components/TokenCard';

export default function ParkingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve confirmation state from navigation or use sample fallback for direct URL access
  const bookingData = location.state || {
    slotNumber: 'P24',
    vehicleNumber: 'MH04AB1234',
    entryTime: '12:35 PM',
    token: 'PK-2026-A8F42',
  };

  const { slotNumber, vehicleNumber, entryTime, token } = bookingData;

  return (
    <div className="page-container narrow-container">
      <div className="confirmation-card">
        <div className="confirmation-success-badge">✓</div>
        <h1 className="page-title text-center">Parking Confirmed</h1>
        <p className="page-subtitle text-center">
          Your slot has been allocated successfully.
        </p>

        <div className="confirmation-details-box">
          <div className="detail-item">
            <span className="detail-label">Parking Slot</span>
            <span className="detail-val font-bold text-primary">{slotNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Vehicle Number</span>
            <span className="detail-val font-bold">{vehicleNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Entry Time</span>
            <span className="detail-val">{entryTime}</span>
          </div>
        </div>

        {/* Prominent Token Card */}
        <TokenCard
          token={token}
          onBack={() => navigate('/')}
        />
      </div>
    </div>
  );
}
