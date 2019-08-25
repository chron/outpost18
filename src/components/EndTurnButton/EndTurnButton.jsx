import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import './EndTurnButton.scss';

function EndTurnButton() {
  const { dispatch } = useContext(GameContext);

  // TODO: warnings about leftover plays / pool?

  return (
    <button type="button" className="end-turn" onClick={() => dispatch({ type: 'endTurn' })}>
      End Turn
    </button>
  );
}

export default EndTurnButton;
