import React from 'react';
import './Hint.scss';
import { useGameState } from '../GameProvider';

function Hint() {
  const { myTurn, gameState, uiMode, setChoice, currentPlayer: { plays, attackPool, globalAttackBonus } } = useGameState();
  let message;

  if (!myTurn) {
    message = 'Waiting for opponent...';
  } else if (gameState === 'begin') {
    message = 'Discard down to 3 cards.';
  } else if (gameState === 'main') {
    if (uiMode) {
      message = (
        <>
          Choose an enemy {uiMode.type}
          <a
            className="hint--link"
            onClick={() => setChoice(null)}
          >
            Cancel
          </a>
        </>
      );
    } else if (attackPool > 0) {
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
      {globalAttackBonus
        ? <p>Your ships have a {globalAttackBonus} attack bonus this turn.</p>
        : null
      }
    </div>
  );
}

export default Hint;
