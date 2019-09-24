import React from 'react';
import { Link } from '@reach/router';
import { useGameState } from '../GameProvider';

function GameOver() {
  const { gameId, winner, player, opponent, rematch, resignAndQuit, readonly } = useGameState();

  const winningPlayer = winner === 'player' ? player : opponent;

  if (readonly) {
    return (
      <div className="full-screen-wrapper">
        <div className="panel interactable">
          <h1>
            {winningPlayer.name} wins!
          </h1>

          <p>
            You can
            {' '}
            <Link to="/game">
              return to the main menu
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="full-screen-wrapper">
      <div className="panel interactable">
        <h1>
          {winner === 'player' ? 'You win!' : 'You lose!'}
        </h1>

        <p>
          A replay of your game is available
          {' '}
          <Link to={`/replay/${gameId}`}>here</Link>
          .
        </p>
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
