import React, { useState } from 'react';
import { Link } from '@reach/router';
import BackBar from '../../components/BackBar';
import Controls from '../../components/Controls';
import Button from '../../components/Button';
import './JoinPrivateGamePage.scss';

export default function JoinPrivateGamePage({ joinGameFunc }) {
  const [gameCode, setGameCode] = useState('');

  return (
    <div className="page page--private center-children">
      <div className="panel">
        <h1>Private game</h1>

        <p>
          The player hosting the game will have received a game code.  Enter that code here.
        </p>

        <div className="game-code__wrapper">
          <label className="label game-code__label">Game code:</label>
          <input className="text-input game-code__input" onChange={e => setGameCode(e.target.value)} value={gameCode} maxLength="5" />
          <Button
            type="button"
            className="button"
            disabled={gameCode.length < 5}
            onClick={() => joinGameFunc(gameCode)}
          >
            Join
          </Button>
        </div>

        <p>You can host your own game here:</p>
        <Controls>
          <Link to="/create/private" className="button">Create game</Link>
        </Controls>
      </div>

      <BackBar />
    </div>
  );
}
