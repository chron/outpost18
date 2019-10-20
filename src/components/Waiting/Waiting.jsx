import React from 'react';
import { useGameState } from '../GameProvider';
import Controls from '../Controls';
import Button from '../Button';

function Waiting() {
  const { joinCode, publicGame, resignAndQuit } = useGameState();

  return (
    <div className="center-children">
      <div className="panel waiting">
        <h1>Waiting for an opponent...</h1>

        {publicGame ? (
          <>
            <p>
              This game is a public game so it will be listed on the lobby screen.
            </p>
          </>
        ) : (
          <>
            <p>
              Your game code is{' '}
              <em>{joinCode}</em>
              .
              {' '}
              Your opponent will need to enter this code in the "Game code" field
              on the "Play a private game" screen and then click "Join" to play against you.
            </p>
            <p>
              You can also send them this link:
            </p>
            <pre>{process.env.URL}/join/{joinCode}</pre>
          </>
        )}

        <Controls>
          <Button onClick={resignAndQuit}>
            Abort game
          </Button>
        </Controls>
      </div>
    </div>
  );
}

export default Waiting;
