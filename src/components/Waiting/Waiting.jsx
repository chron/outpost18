import React from 'react';
import { useGameState } from '../GameProvider';

function Waiting() {
  const { joinCode, publicGame, resignAndQuit } = useGameState();

  return (
    <div className="center-children">
      <div className="panel waiting">
        <h1>Waiting for your opponent...</h1>

        {publicGame ? (
          <p>
            This game is a public game so it will be listed on the lobby screen.
          </p>
        ) : (
          <>
            <p>
              Your game code is{' '}
              <em>{joinCode}</em>
              .
              {' '}
              Your opponent will need to enter this code in the "Game code" field
                on the main screen and then click "Join Game" to play against you.
                You can also send them this link:
            </p>
            <pre>{process.env.URL}/join/{joinCode}</pre>
          </>
        )}

        <p>
          You can{' '}
          <a onClick={resignAndQuit}>
            abandon this game
          </a>
          {' '}and return to the menu.
        </p>
      </div>
    </div>
  );
}

export default Waiting;
