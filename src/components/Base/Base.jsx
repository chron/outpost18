import React, { useContext } from 'react';
import './Base.scss';

// TODO: kind of annoyingly non-DRY with upgrade stuff here

function Base({ stats }) {
  const { name, draws, shields } = stats;

  return (
    <div className="base">
      <div className="upgrade">
        <div className={`upgrade__shields upgrade__shields--reverse`}>
          {shields}
        </div>

        <div className="upgrade__powers">
          {Array(draws || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">+<br />Draw</div>)}
        </div>

        <div className={`upgrade__shields`}>
          {shields}
        </div>
      </div>

      <div className="base__main">
        <div className="base__name">{name}</div>
        <div className="base__image"></div>
        <div className="base__name base__name--reverse">{name}</div>
      </div>
    </div>
  );
}

export default Base;
