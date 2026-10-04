import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TokenCard from '../components/TokenCard';

export default function ParkingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve confirmation state from navigation
  const bookingData = location.state;

  if (!bookingData || !bookingData.token) {
    return (
      <div className="page-container narrow-container">
        <div className="confirmation-card text-center py-5">
          <h1 className="page-title">No Active Parking Session</h1>
          <p className="page-subtitle mb-4">
            No active parking session found. Please book a parking slot first.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-large"
            onClick={() => navigate('/layout')}
          >
            Find Parking
          </button>
        </div>
      </div>
    );
  }

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
