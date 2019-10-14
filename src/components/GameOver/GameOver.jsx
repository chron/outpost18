import React from 'react';
import { Link } from '@reach/router';
import { useGameState } from '../GameProvider';
import Controls from '../Controls';
import Button from '../Button';

function GameOver() {
  const {
    gameId,
    eloChange,
    publicGame,
    winner,
    player,
    opponent,
    rematch,
    resignAndQuit,
    readonly,
  } = useGameState();

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
            <Link to="/menu">
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

        {eloChange
          ? <p>You {winner === 'player' ? 'gained' : 'lost'} {eloChange} rating.</p>
          : null
        }

        <Controls>
          <Link className="button" to={`/replay/${gameId}`}>
            View replay
          </Link>

          {publicGame
            ? null
            : <Button onClick={rematch}>Rematch</Button>
          }

          <Button onClick={resignAndQuit}>
            Main Menu
          </Button>
        </Controls>
      </div>
    </div>
  );
}

export default GameOver;
