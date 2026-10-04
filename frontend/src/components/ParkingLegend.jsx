import React from 'react';

export default function ParkingLegend() {
  return (
    <div className="parking-legend">
      <div className="legend-item">
        <span className="legend-indicator legend-available">🟢</span>
        <span className="legend-label">Available</span>
      </div>
      <div className="legend-item">
        <span className="legend-indicator legend-occupied">🔴</span>
        <span className="legend-label">Occupied</span>
      </div>
      <div className="legend-item">
        <span className="legend-indicator legend-reserved">🟡</span>
        <span className="legend-label">Reserved</span>
      </div>
    </div>
  );
}
