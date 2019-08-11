import React, { useContext } from 'react';
import './Base.scss';

function Base({ stats }) {
  const { name, draws, defense } = stats;

  return (
    <div className="base">
      {name} ({defense})
    </div>
  );
}

export default Base;
