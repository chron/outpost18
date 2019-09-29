import React, { useState } from 'react';
import { Link, navigate } from '@reach/router';
import BackBar from '../../components/BackBar';
import Controls from '../../components/Controls';
import Button from '../../components/Button';
import './JoinPrivateGamePage.scss';

export default function JoinPrivateGamePage({ joinGameFunc }) {
  const [gameCode, setGameCode] = useState('');
  const joinPrivateGame = () => {
    joinGameFunc(gameCode).then(() => navigate('/game'));
  };

  return (
    <div className="page page--private center-children">
      <div className="panel">
        <h1>Private game</h1>

        <p>
          The player hosting the game will have received a game code.  Enter that code here.
        </p>

        <div className="fieldset__wrapper">
          <label htmlFor="gameCodeInput" className="label fieldset__label">
            Game code:
          </label>
          <input
            id="gameCodeInput"
            className="text-input fieldset__input"
            onChange={e => setGameCode(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') { joinPrivateGame(); }
            }}
            value={gameCode}
            maxLength="5"
          />
          <Button
            type="button"
            className="button"
            disabled={gameCode.length < 5}
            onClick={joinPrivateGame}
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
