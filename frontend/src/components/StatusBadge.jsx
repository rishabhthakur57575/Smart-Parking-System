import React from 'react';

export default function StatusBadge({ status }) {
  const normalizedStatus = (status || '').toUpperCase();

  const getStatusClass = () => {
    switch (normalizedStatus) {
      case 'AVAILABLE':
        return 'badge-available';
      case 'OCCUPIED':
        return 'badge-occupied';
      case 'RESERVED':
        return 'badge-reserved';
      case 'ACTIVE':
        return 'badge-active';
      case 'COMPLETED':
        return 'badge-completed';
      default:
        return 'badge-default';
    }
  };

  const getDot = () => {
    switch (normalizedStatus) {
      case 'AVAILABLE':
      case 'COMPLETED':
        return '🟢';
      case 'OCCUPIED':
        return '🔴';
      case 'RESERVED':
        return '🟡';
      case 'ACTIVE':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      <span className="badge-dot" aria-hidden="true">{getDot()}</span>
      <span className="badge-text">{normalizedStatus}</span>
    </span>
  );
}
