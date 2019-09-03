import React from 'react';
import { useGameState } from '../GameProvider';
import './EndTurnButton.scss';

function EndTurnButton() {
  const { dispatch, gameState, myTurn } = useGameState();

  // TODO: warnings about leftover plays / pool?
  // disabled={!myTurn || gameState !== 'main'}

  return (
    <button
      type="button"
      className="end-turn"
      onClick={() => dispatch({ type: 'endTurn' })}
    >
      End Turn
    </button>
  );
}

export default EndTurnButton;
