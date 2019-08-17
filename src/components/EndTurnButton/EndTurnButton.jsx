import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import './EndTurnButton.scss';

function PlayerStats() {
  const { currentPlayer: { name, plays, attackPool }, dispatch } = useContext(GameContext);

  // todo: warnings about leftover plays / pool?

  return (
    <button className="end-turn" onClick={()=> dispatch({ type: 'endTurn' })}>
      End Turn
    </button>
  );
}

PlayerStats.propTypes = {
  card: PropTypes.object,
};

export default PlayerStats;
