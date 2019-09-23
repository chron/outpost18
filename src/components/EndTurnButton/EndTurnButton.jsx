import React from 'react';
import { useGameState } from '../GameProvider';
import './EndTurnButton.scss';

function EndTurnButton() {
  const { dispatch, gameState, uiMode, myTurn, readonly } = useGameState();

  // TODO: warnings about leftover plays / pool?

  return (
    <button
      type="button"
      className="button end-turn"
      disabled={!myTurn || readonly || uiMode || gameState !== 'main'}
      onClick={() => dispatch({ type: 'endTurn' })}
    >
      End<br />
      Turn
    </button>
  );
}

export default EndTurnButton;
