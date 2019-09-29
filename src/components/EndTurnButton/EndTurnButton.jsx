import React from 'react';
import { useGameState } from '../GameProvider';
import Button from '../Button';

function EndTurnButton() {
  const { dispatch, gameState, uiMode, myTurn, readonly } = useGameState();

  // TODO: warnings about leftover plays / pool?

  return (
    <Button
      type="button"
      disabled={!myTurn || readonly || uiMode || gameState !== 'main'}
      onClick={() => dispatch({ type: 'endTurn' })}
    >
      End<br />
      Turn
    </Button>
  );
}

export default EndTurnButton;
