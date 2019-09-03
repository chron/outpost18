import React, { useState } from 'react';
import './Welcome.scss';

function Welcome({ playerName, setPlayerName, joinGame, createGame }) {
  const [gameCode, setGameCode] = useState('');

  // TODO: clear code after join?

  return (
    <div className="welcome">
      <label>Your name:</label>
      <input onChange={e => setPlayerName(e.target.value)} value={playerName} />

      <label>Game code:</label>
      <input onChange={e => setGameCode(e.target.value)} value={gameCode} maxLength="5" />
      <button onClick={() => joinGame(gameCode)}>Join Game</button>
      <button onClick={createGame}>Create Game</button>
    </div>
  );
}

export default Welcome;
