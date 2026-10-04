import React from 'react';
import StatusBadge from './StatusBadge';

export default function ParkingTable({ records = [], isDetailed = false }) {
  if (!records || records.length === 0) {
    return (
      <div className="table-empty-state">
        <p>No parking activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-container">
      <table className="parking-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Vehicle Number</th>
            <th>Slot</th>
            <th>Entry Time</th>
            {isDetailed && <th>Exit Time</th>}
            {isDetailed && <th>Duration</th>}
            {isDetailed && <th>Amount</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, index) => (
            <tr key={rec.token || index}>
              <td className="font-mono text-bold">{rec.token || '-'}</td>
              <td>{rec.vehicleNumber || '-'}</td>
              <td>
                <span className="slot-pill">{rec.slotNumber || rec.slot || '-'}</span>
              </td>
              <td>{rec.entryTime || '-'}</td>
              {isDetailed && <td>{rec.exitTime || '-'}</td>}
              {isDetailed && <td>{rec.duration || '-'}</td>}
              {isDetailed && (
                <td className="font-semibold">
                  {typeof rec.amount === 'number' ? `₹${rec.amount}` : rec.amount || '-'}
                </td>
              )}
              <td>
                <StatusBadge status={rec.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
