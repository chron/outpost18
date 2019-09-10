import React from 'react';
import { useGameState } from '../GameProvider';

function Waiting() {
  const { joinCode, resignAndQuit } = useGameState();

  return (
    <div className="center-children">
      <div className="panel waiting">
        <h1>Waiting for your opponent...</h1>
        <p>
          Your game code is{' '}
          <em>{joinCode}</em>
          .
          {' '}
          Your opponent will need to enter this code in the "Game code" field
          on the main screen and then click "Join Game" to play against you.
        </p>

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
