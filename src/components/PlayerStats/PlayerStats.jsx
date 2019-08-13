import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import EndTurnButton from '../EndTurnButton';
import { resources, sumResourceForPlayer } from '../../utils';

import './PlayerStats.scss';

function PlayerStats({ playerName, position = 'bottom' }) {
  const state = useContext(GameContext);
  const player = state.players.find(p => p.name === playerName);
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

      {resources.map(r => {
        const amount = sumResourceForPlayer(state, r, player);
        if (amount <= 0 ) { return null; }
        return (
          <div key={r} className="player-stats__stat player-stats__stat--resource">
            <div className="player-stats__label">{r}</div>
            {amount}
          </div>
        );
      })}
      <EndTurnButton />
    </div>
  );
}

PlayerStats.propTypes = {
  card: PropTypes.object,
};

export default PlayerStats;
