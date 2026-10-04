import React from 'react';

export default function DashboardCard({ title, value, type = 'default' }) {
  return (
    <div className={`stat-card stat-${type}`}>
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
