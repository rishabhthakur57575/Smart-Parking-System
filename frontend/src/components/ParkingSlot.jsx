import React from 'react';

export default function ParkingSlot({
  slotNumber,
  status = 'AVAILABLE',
  vehicleNumber,
  entryTime,
  isSelected = false,
  onSelect,
}) {
  const normalizedStatus = status.toUpperCase();
  const isAvailable = normalizedStatus === 'AVAILABLE';

  const handleClick = () => {
    if (isAvailable && onSelect) {
      onSelect(slotNumber);
    }
  };

  const handleKeyDown = (e) => {
    if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (onSelect) onSelect(slotNumber);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      aria-label={`Parking slot ${slotNumber}, status ${normalizedStatus}`}
      aria-disabled={!isAvailable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`parking-slot slot-${normalizedStatus.toLowerCase()} ${
        isSelected ? 'slot-selected' : ''
      } ${!isAvailable ? 'slot-disabled' : 'slot-clickable'}`}
    >
      <div className="slot-header">
        <span className="slot-number">{slotNumber}</span>
      </div>
      <div className="slot-status-text">
        {normalizedStatus}
      </div>
      {vehicleNumber && (
        <div className="slot-vehicle" title={`Vehicle: ${vehicleNumber}`}>
          {vehicleNumber}
        </div>
      )}
    </div>
  );
}
