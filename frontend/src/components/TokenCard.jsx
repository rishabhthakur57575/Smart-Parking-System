import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TokenCard({ token, onBack }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="token-card-wrapper">
      <div className="token-banner">YOUR PARKING TOKEN</div>
      <div className="token-display">
        <span className="token-text">{token}</span>
      </div>
      <p className="token-notice">
        Keep this token safe. You will need it when exiting the parking.
      </p>

      <div className="token-buttons">
        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-secondary btn-copy"
        >
          {copied ? '✓ Token Copied!' : 'Copy Token'}
        </button>

        {onBack ? (
          <button type="button" onClick={onBack} className="btn btn-primary">
            Back to Dashboard
          </button>
        ) : (
          <Link to="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
