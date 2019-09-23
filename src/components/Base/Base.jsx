import React from 'react';
import Upgrade from '../Upgrade';
import './Base.scss';
import * as bases from '../../assets/images/bases/*.png';

const BASE_NAME = 'Station Core';

function Base({ friendly = false, owner }) {
  return (
    <div className="base">
      <Upgrade cardName={BASE_NAME} friendly={friendly} owner={owner} />

      <div className="base__main">
        <div className="base__name">{BASE_NAME}</div>
        <div className="base__image">
          <img
            src={bases[friendly ? 'station-core-1' : 'station-core-2']}
            alt="Station Core"
          />
        </div>
        <div className="base__name base__name--reverse">{owner.name}</div>
      </div>
    </div>
  );
}

export default Base;
