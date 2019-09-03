import React from 'react';
import './Hint.scss';
import { useGameState } from '../GameProvider';

function Hint() {
  const { myTurn, gameState, currentPlayer: { plays, attackPool } } = useGameState();
  let message;

  if (!myTurn) {
    message = 'Waiting for opponent...';
  } else if (gameState === 'begin') {
    message = 'Discard down to 3 cards.';
  } else if (gameState === 'main') {
    if (attackPool > 0) {
      message = 'Spend your attack by clicking on the enemy base.';
    } else if (plays > 0) {
      message = 'You can drag a ship from your hand to play it.';
    } else {
      message = 'Click End Turn once you are finished.';
    }
  }

  if (!message) { return null; }

  return (
    <div className="hint">
      {message}
    </div>
  );
}

export default Hint;
