import React, { useState, useEffect } from 'react';
import ParkingTable from '../components/ParkingTable';
import { parkingService } from '../services/api';

export default function ParkingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await parkingService.getHistory();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Unable to load parking records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Parking History</h1>
        <p className="page-subtitle">
          Comprehensive log of all active and completed parking sessions.
        </p>
      </div>

      {error && (
        <div className="notification-banner error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p>Loading parking records...</p>
        </div>
      ) : (
        <div className="content-card">
          <div className="card-header-flex">
            <span className="card-record-count">
              Total Records: {history.length}
            </span>
          </div>
          <ParkingTable records={history} isDetailed={true} />
        </div>
      )}
    </div>
  );
}
