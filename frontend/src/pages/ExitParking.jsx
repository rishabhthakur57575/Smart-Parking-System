import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentSummary from '../components/PaymentSummary';
import { parkingService } from '../services/api';

export default function ExitParking() {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [exitDetails, setExitDetails] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setError('Please enter your parking token.');
      return;
    }

    setIsSearching(true);
    setError('');
    setExitDetails(null);

    try {
      const data = await parkingService.findExitDetails(cleanToken);
      if (data && data.totalAmount !== undefined) {
        setExitDetails(data);
      } else {
        throw new Error('Invalid parking token.');
      }
    } catch (err) {
      console.error('Exit query error:', err);
      setError('Invalid parking token.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!exitDetails) return;
    navigate('/payment', {
      state: {
        exitDetails,
      },
    });
  };

  return (
    <div className="page-container narrow-container">
      <div className="page-header">
        <h1 className="page-title">Exit Parking</h1>
        <p className="page-subtitle">
          Enter your parking token to calculate your parking charges.
        </p>
      </div>

      <div className="exit-form-card">
        <form onSubmit={handleSearch} className="token-search-form">
          <div className="form-group">
            <label className="form-label" htmlFor="parkingTokenInput">
              Parking Token
            </label>
            <div className="token-input-group">
              <input
                id="parkingTokenInput"
                type="text"
                className="form-input token-input"
                placeholder="e.g. PK-2026-A8F42"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value.toUpperCase());
                  if (error) setError('');
                }}
                disabled={isSearching}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSearching || !tokenInput.trim()}
              >
                {isSearching ? 'Finding...' : 'Find Parking'}
              </button>
            </div>
          </div>
        </form>

        {isSearching && (
          <div className="small-loading-notice">
            Calculating parking charges...
          </div>
        )}

        {error && (
          <div className="form-error-msg" role="alert">
            {error}
          </div>
        )}

        {exitDetails && (
          <div className="exit-results-box">
            <h3 className="section-label mb-2">Parking Charges Summary</h3>
            <PaymentSummary details={exitDetails} />

            <div className="mt-4 text-center">
              <button
                type="button"
                className="btn btn-primary btn-large btn-block"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
