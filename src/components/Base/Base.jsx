import React from 'react';
import Upgrade from '../Upgrade';
import './Base.scss';

function Base({ cardName, owner }) {
  return (
    <div className="base">
      <Upgrade cardName={cardName} owner={owner} />

      <div className="base__main">
        <div className="base__name">{cardName}</div>
        <div className="base__image"></div>
        <div className="base__name base__name--reverse">{cardName}</div>
      </div>
    </div>
  );
}

export default Base;
