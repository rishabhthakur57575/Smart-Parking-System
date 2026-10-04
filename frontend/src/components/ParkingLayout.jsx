import React from 'react';
import ParkingSlot from './ParkingSlot';

export default function ParkingLayout({ slots = [], selectedSlot, onSelectSlot }) {
  return (
    <div className="parking-facility-card">
      <div className="facility-header">
        <div className="facility-title-wrap">
          <h2 className="facility-title">Parking Area</h2>
          <span className="facility-subtitle">Physical Slot Grid (50 Slots)</span>
        </div>
        <div className="facility-entrance-tag">
          <span className="entrance-arrow">↓</span> ENTRANCE LANE
        </div>
      </div>

      <div className="parking-grid" role="region" aria-label="Parking slots grid">
        {slots.map((slot) => (
          <ParkingSlot
            key={slot.id || slot.slotNumber}
            slotNumber={slot.slotNumber}
            status={slot.status}
            vehicleNumber={slot.vehicleNumber}
            entryTime={slot.entryTime}
            isSelected={selectedSlot === slot.slotNumber}
            onSelect={onSelectSlot}
          />
        ))}
      </div>

      <div className="facility-footer">
        <div className="facility-exit-tag">
          <span className="exit-arrow">↑</span> EXIT LANE
        </div>
      </div>
    </div>
  );
}
