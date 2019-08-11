import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import EndTurnButton from '../EndTurnButton';
import { resources, sumResourceForPlayer } from '../../utils';

import './PlayerStats.scss';

function PlayerStats({ playerName, position = 'bottom' }) {
  const { players } = useContext(GameContext);
  const { inPlay, name, plays, attackPool } = players.find(p => p.name === playerName);

  return (
    <div className={`player-stats player-stats--${position}`}>
      <div className="player-stats__name">{name}</div>
      <div className="player-stats__stat">Plays: {plays}</div>
      <div className="player-stats__stat">Attack: {attackPool}</div>

      {resources.map(r => {
        const amount = sumResourceForPlayer(r, inPlay);
        if (amount <= 0 ) { return null; }
        return <div key={r} className="player-stats__resource">{r}: {amount}</div>
      })}
      <EndTurnButton />
    </div>
  );
}

PlayerStats.propTypes = {
  card: PropTypes.object,
};

export default PlayerStats;
