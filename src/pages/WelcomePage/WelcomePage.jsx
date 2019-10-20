import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Controls from '../../components/Controls';
import Button from '../../components/Button';

import './WelcomePage.scss';

function WelcomePage({ playerName, setPlayerName }) {
  const [localName, setLocalName] = useState(playerName || '');

  const handleConfirm = () => {
    if (!localName || localName === '') {
      // TODO: Validation message?
    } else {
      setPlayerName(localName);
      navigate('/menu');
    }
  };

  return (
    <div className="page page--welcome center-children">
      <div className="panel">
        <div className="game-title">Outpost 18</div>

        <p>
          Welcome to Outpost 18!  Please enter your name.
        </p>

        <div className="fieldset__wrapper">
          <label htmlFor="playerName" className="label fieldset__label">Your name:</label>
          <input
            autoFocus
            id="playerName"
            className="text-input fieldset__input"
            maxLength={30}
            onChange={e => setLocalName(e.target.value)}
            value={localName}
            onKeyPress={e => {
              if (e.key === 'Enter') { handleConfirm(); }
            }}
          />
        </div>

        <Controls>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Controls>
      </div>
    </div>
  );
}

export default WelcomePage;
