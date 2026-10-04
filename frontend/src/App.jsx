import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ParkingLayoutPage from './pages/ParkingLayoutPage';
import ParkingConfirmation from './pages/ParkingConfirmation';
import ExitParking from './pages/ExitParking';
import Payment from './pages/Payment';
import ParkingHistory from './pages/ParkingHistory';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/layout" element={<ParkingLayoutPage />} />
            <Route path="/confirmation" element={<ParkingConfirmation />} />
            <Route path="/exit" element={<ExitParking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/history" element={<ParkingHistory />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-container">
            <span>SmartPark — Smart Parking Management System</span>
            <span className="footer-sub">College Java Mini-Project</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
