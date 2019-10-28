import React from 'react';
import Controls from '../Controls';
import Button from '../Button';
import './TutorialMessage.scss';

function TutorialMessage({ message, buttonText = 'Continue', onClick }) {
  const bodyText = message.split('\n').map((p, i) => <p key={i}>{p}</p>);
  return (
    <div className="tutorial-message__wrapper">
      <div className="tutorial-message">
        {bodyText}

        <Controls>
          <Button onClick={onClick}>
            {buttonText}
          </Button>
        </Controls>
      </div>
    </div>
  );
}

export default TutorialMessage;
