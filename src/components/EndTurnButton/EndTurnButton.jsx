import React from 'react';
import { useGameState } from '../GameProvider';
import './EndTurnButton.scss';

function EndTurnButton() {
  const { dispatch, gameState, myTurn } = useGameState();

  // TODO: warnings about leftover plays / pool?

  return (
    <button
      type="button"
      className="end-turn"
      disabled={!myTurn || gameState !== 'main'}
      onClick={() => dispatch({ type: 'endTurn' })}
    >
      End Turn
    </button>
  );
}

export default EndTurnButton;
