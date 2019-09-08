import React from 'react';
import Upgrade from '../Upgrade';
import './Base.scss';

const BASE_NAME = 'Station Core';

function Base({ friendly = false, owner }) {
  return (
    <div className="base">
      <Upgrade cardName={BASE_NAME} friendly={friendly} owner={owner} />

      <div className="base__main">
        <div className="base__name">{BASE_NAME}</div>
        <div className="base__image" />
        <div className="base__name base__name--reverse">{BASE_NAME}</div>
      </div>
    </div>
  );
}

export default Base;
