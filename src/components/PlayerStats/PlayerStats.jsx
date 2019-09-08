import React from 'react';
import { resources, sumResourceForPlayer } from '../../utils';
import ResourceIcon from '../ResourceIcon';
import './PlayerStats.scss';

// TODO: draws icon
function PlayerStats({ player, position = 'bottom', children }) {
  const { name, hand, handSize, plays, attackPool } = player;

  return (
    <div className={`player-stats player-stats--${position}`}>
      <div className="player-stats__name">{name}</div>
      <div className="player-stats__stat">
        <div className="player-stats__label">cards</div>
        {handSize === undefined ? hand.length : handSize}
      </div>
      <div className="player-stats__stat">
        <div className="player-stats__label">plays</div>
        {plays}
      </div>
      <div className="player-stats__stat">
        <div className="player-stats__label">attack</div>
        {attackPool}
      </div>

      <div className="player-stats__resources">
        {Object.keys(resources).map((resource) => {
          const amount = sumResourceForPlayer(resource, player);

          return (
            <div key={resource} className="player-stats__resource">
              <div className="player-stats__resource-amount">{amount}</div>
              <div className="player-stats__resource-icon">
                {resource === 'draws'
                  ? 'Draws'
                  : <ResourceIcon resource={resource} num={1} />
                }
              </div>
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

export default PlayerStats;
