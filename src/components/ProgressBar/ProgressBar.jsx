import React from 'react';
import './ProgressBar.scss';

// TODO: draws icon
export default function ProgressBar({ current, max }) {
  const percent = current / max * 100;

  return (
    <div className="progress-bar">
      <div className="progress-bar__bar" style={{ width: `${percent}%` }} />
    </div>
  );
}
