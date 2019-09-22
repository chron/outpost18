import React, { useState } from 'react';
import './Welcome.scss';

function Welcome({ playerName, setPlayerName, joinGame }) {
  const [gameCode, setGameCode] = useState('');
  const [nextGamePublic, setNextGamePublic] = useState(true);
  const [nextGameSolo, setNextGameSolo] = useState(false);

  return (
    <div className="full-screen-wrapper">
      <div className="welcome__panel interactable">
        <div className="welcome__title">Outpost 18</div>
        <div className="welcome__subtitle">Unofficial digital version</div>

        <div className="welcome__section welcome__section--vertical">
          <p>
            This is a fan implementation of the micro cardgame Outpost 18 by ANGRYCYBORGGAMES. You can read the
            Outpost 18 rules <a href="http://playoutpost18.com" target="_blank">on the official site</a>.
          </p>

          <p>
            There is a very basic AI you can play against by checking the box below.
            It won&apos;t provide much of a challenge but it is a good chance to get used to the interface.
          </p>

          <p>
            This is unpolished beta software!
            {' '}Bug reports and ideas are welcome.
            {' '}You can <a href="mailto:paul@paulandemma.co.nz">email me</a>
            {' '}with any feedback.
          </p>
        </div>

        <div className="welcome__section">
          <div className="welcome__field">
            <label className="welcome__label">Your name:</label>
            <input className="text-input" maxLength={30} onChange={e => setPlayerName(e.target.value)} value={playerName} />
          </div>
        </div>

        <div className="welcome__section">
          <div className="welcome__item">
              <div className="welcome__field">
                <input
                  id="nextGamePublic"
                  type="checkbox"
                  disabled={nextGameSolo}
                  onChange={e => setNextGamePublic(e.target.checked)}
                  checked={nextGamePublic}
                />
                <label htmlFor="nextGamePublic" className="welcome__label">
                  Show game in lobby
                </label>
              </div>

              <div className="welcome__field">
                <input
                  id="nextGameSolo"
                  type="checkbox"
                  onChange={e => {
                    setNextGameSolo(e.target.checked);
                    setNextGamePublic(false);
                  }}
                  checked={nextGameSolo}
                />
                <label htmlFor="nextGameSolo" className="welcome__label">
                  Add an AI opponent
                </label>
              </div>

            <button className="button" onClick={() => joinGame(null, null, nextGamePublic, nextGameSolo)}>Create Game</button>

          </div>

          <div className="welcome__item">
            <div className="welcome__field">
              <label className="welcome__label">Game code:</label>
              <input className="text-input" onChange={e => setGameCode(e.target.value)} value={gameCode} maxLength="5" />
            </div>
            <button
              type="button"
              className="button"
              disabled={gameCode.length < 5}
              onClick={() => joinGame(gameCode)}
            >
                Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
