import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import ParkingLegend from '../components/ParkingLegend';
import ParkingTable from '../components/ParkingTable';
import { parkingService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 50,
    available: 27,
    occupied: 0,
    reserved: 23,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [slotsData, historyData] = await Promise.all([
        parkingService.getAllSlots(),
        parkingService.getHistory(),
      ]);

      if (Array.isArray(slotsData)) {
        const total = slotsData.length;
        const available = slotsData.filter((s) => s.status === 'AVAILABLE').length;
        const occupied = slotsData.filter((s) => s.status === 'OCCUPIED').length;
        const reserved = slotsData.filter((s) => s.status === 'RESERVED').length;

        setStats({
          total,
          available,
          occupied,
          reserved,
        });
      }

      if (Array.isArray(historyData)) {
        setRecentActivity(historyData.slice(0, 5));
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setErrorMessage('Unable to load parking details. Showing default data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Smart Parking Management System</h1>
        <p className="page-subtitle">
          Manage parking slots, bookings and vehicle exits.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading parking slots...</p>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="notification-banner warning">
              {errorMessage}
            </div>
          )}

          {/* 4 Statistics Cards */}
          <div className="stats-grid">
            <DashboardCard
              title="Total Slots"
              value={stats.total}
              type="default"
            />
            <DashboardCard
              title="Available"
              value={stats.available}
              type="available"
            />
            <DashboardCard
              title="Occupied"
              value={stats.occupied}
              type="occupied"
            />
            <DashboardCard
              title="Reserved"
              value={stats.reserved}
              type="reserved"
            />
          </div>

          {/* Status Legend Section */}
          <div className="dashboard-status-section">
            <h3 className="section-label">Parking Status</h3>
            <ParkingLegend />
          </div>

          {/* Primary Action Buttons */}
          <div className="primary-actions-row">
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={() => navigate('/layout')}
            >
              Find Parking
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/exit')}
            >
              Exit Parking
            </button>
          </div>

          {/* Recent Parking Activity */}
          <div className="content-section">
            <div className="section-header-row">
              <h2 className="section-title">Recent Parking Activity</h2>
            </div>
            <ParkingTable records={recentActivity} isDetailed={false} />
          </div>
        </>
      )}
    </div>
  );
}
