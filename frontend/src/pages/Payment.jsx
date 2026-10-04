import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentSummary from '../components/PaymentSummary';
import { parkingService } from '../services/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve exit details from state or fallback for demo
  const exitDetails = location.state?.exitDetails || {
    token: 'PK-2026-A8F42',
    vehicleNumber: 'MH04AB1234',
    slotNumber: 'P24',
    entryTime: '12:35 PM',
    currentTime: '03:20 PM',
    duration: '3 Hours',
    rate: '₹30/hour',
    ratePerHour: 30,
    totalAmount: 90,
  };

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const handlePay = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      const response = await parkingService.processPayment(
        exitDetails.token,
        paymentMethod
      );

      if (response && response.success) {
        setTransactionId(response.transactionId || 'TXN-849321');
        setPaymentSuccess(true);
      } else {
        throw new Error('Payment processing failed.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-container narrow-container">
      <div className="page-header text-center">
        <h1 className="page-title">Parking Payment</h1>
        <p className="page-subtitle">Demo payment checkout for parking exit.</p>
      </div>

      <div className="payment-card">
        {paymentSuccess ? (
          <div className="payment-success-view">
            <div className="success-icon-badge">✓</div>
            <h2 className="success-title">Payment Successful</h2>

            <div className="txn-box">
              <span className="txn-label">Transaction ID:</span>
              <span className="txn-id">{transactionId}</span>
            </div>

            <div className="payment-receipt-summary">
              <div className="receipt-row">
                <span>Parking Token</span>
                <span className="font-mono">{exitDetails.token}</span>
              </div>
              <div className="receipt-row">
                <span>Vehicle Number</span>
                <span>{exitDetails.vehicleNumber}</span>
              </div>
              <div className="receipt-row">
                <span>Released Slot</span>
                <span className="font-bold text-success">{exitDetails.slotNumber}</span>
              </div>
              <div className="receipt-row">
                <span>Amount Paid</span>
                <span className="font-bold">₹{exitDetails.totalAmount} via {paymentMethod}</span>
              </div>
            </div>

            <div className="success-notice">
              <p className="notice-main">Parking completed successfully.</p>
              <p className="notice-sub">Your parking slot has been released.</p>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="btn btn-primary btn-large btn-block"
                onClick={() => navigate('/')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="demo-badge-bar">
              <span className="demo-pill">DEMO PAYMENT MODE</span>
              <span className="demo-subtext">No real transaction will occur</span>
            </div>

            <PaymentSummary details={exitDetails} />

            <div className="payment-methods-section">
              <h3 className="methods-title">Select Payment Method</h3>
              <div className="methods-group" role="radiogroup" aria-label="Payment method">
                <label className={`method-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessing}
                  />
                  <span className="method-label">UPI (Google Pay / PhonePe / Paytm)</span>
                </label>

                <label className={`method-option ${paymentMethod === 'Card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessing}
                  />
                  <span className="method-label">Debit / Credit Card</span>
                </label>

                <label className={`method-option ${paymentMethod === 'Cash' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessing}
                  />
                  <span className="method-label">Cash at Parking Counter</span>
                </label>
              </div>
            </div>

            {paymentError && (
              <div className="form-error-msg mt-3" role="alert">
                {paymentError}
              </div>
            )}

            <div className="mt-4">
              <button
                type="button"
                className="btn btn-primary btn-large btn-block"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${exitDetails.totalAmount}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
