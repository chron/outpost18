import React from 'react';
import Upgrade from '../Upgrade';
import './Base.scss';

function Base({ cardName, playerName }) {
  return (
    <div className="base">
      <Upgrade cardName={cardName} playerName={playerName} />

      <div className="base__main">
        <div className="base__name">{name}</div>
        <div className="base__image"></div>
        <div className="base__name base__name--reverse">{name}</div>
      </div>
    </div>
  );
}

export default Base;
