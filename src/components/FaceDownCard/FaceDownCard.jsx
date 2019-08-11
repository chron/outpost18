import React from 'react';
import './FaceDownCard.scss';

function FaceDownCard({ count = 1 }) {
  return (
    <div className="card card--face-down">
      {count > 1 ? <div className="pile-count">{count}</div> : null}
    </div>
  );
}

export default FaceDownCard;
