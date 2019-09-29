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
    <div className="full-screen-wrapper">
      <div className="panel interactable">
        <div className="welcome__title">Outpost 18</div>

        <div className="welcome__section welcome__section--vertical">
          <p>
            Welcome to Outpost 18!  Please enter your name.
          </p>
        </div>

        <div className="welcome__section">
          <div className="welcome__field">
            <label htmlFor="playerName" className="welcome__label">Your name:</label>
            <input
              autoFocus
              id="playerName"
              className="text-input"
              maxLength={30}
              onChange={e => setLocalName(e.target.value)}
              value={localName}
              onKeyPress={e => {
                if (e.key === 'Enter') { handleConfirm(); }
              }}
            />
          </div>
        </div>

        <Controls>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Controls>
      </div>
    </div>
  );
}

export default WelcomePage;
