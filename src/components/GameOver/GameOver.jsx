import React from 'react';
import { useGameState } from '../GameProvider';

function GameOver() {
  const { activePlayer, rematch, resignAndQuit } = useGameState();

  return (
    <div className="full-screen-wrapper">
      <div className="panel">
        <h1>
          {activePlayer === 'player' ? 'You win!' : 'You lose!'}
        </h1>

        <p>
          You can{' '}
          <a onClick={rematch}>
            challenge the same opponent again
          </a>
          {' '}or{' '}
          <a onClick={resignAndQuit}>
            return to the main menu
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default GameOver;
