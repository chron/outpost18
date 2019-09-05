import React from 'react';
import './FaceDownCard.scss';

function FaceDownCard({ count }) {
  return (
    <div className="card card--face-down">
      {count === undefined ? '' : <div className="pile-count">{count}</div>}
    </div>
  );
}

export default FaceDownCard;
