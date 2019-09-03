import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import EndTurnButton from '../EndTurnButton';
import { resources, sumResourceForPlayer } from '../../utils';

import './PlayerStats.scss';

function PlayerStats({ player, position = 'bottom' }) {
  const state = useContext(GameContext);
  const { name, hand, plays, attackPool } = player;

  return (
    <div className={`player-stats player-stats--${position}`}>
      <div className="player-stats__name">{name}</div>
      <div className="player-stats__stat">
        <div className="player-stats__label">cards</div>
        {hand.length}
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
        {Object.entries(resources).map(([resource, { icon }]) => {
          const amount = sumResourceForPlayer(resource, player);

          return (
            <div key={resource} className="player-stats__resource">
              <div className="player-stats__resource-amount">{amount}</div>
              <div className="player-stats__resource-icon">{icon}</div>
            </div>
          );
        })}
      </div>

      {state.currentPlayer.playerId === player.playerId && <EndTurnButton />}
    </div>
  );
}

export default PlayerStats;