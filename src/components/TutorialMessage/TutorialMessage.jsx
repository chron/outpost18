import React from 'react';
import Controls from '../Controls';
import Button from '../Button';
import StaticCard from '../StaticCard';
import './TutorialMessage.scss';

function TutorialMessage({ message, buttonText = 'Continue', onClick, highlight, overlay }) {
  const bodyText = message.split('\n').map((p, i) => <p key={i}>{p}</p>);

  let top, left, width, height;
  let marginTop;

  if (highlight === 'hand') {
    top = '78vh';
    left = 0;
    width = '100vw';
    height = '21vh';
  } else if (highlight === 'base') {
    top = '61vh';
    left = 0;
    width = '50vw';
    height = '15vh';
    marginTop = '-20%';
  } else if (highlight === 'stats') {
    top = '61vh';
    left = '49vw';
    width = '51vw';
    height = '15vh';
    marginTop = '-20%';
  } else if (highlight === 'ships') {
    top = '40vh';
    left = '15vh';
    width = '100vw';
    height = '20vh';
    marginTop = '-60%';
  } else if (highlight === 'deck-discard') {
    top = '18vh';
    left = 0;
    width = '15vh';
    height = '41vh';
    marginTop = '50%';
  } else if (highlight === 'enemy-base') {
    top = '1vh';
    left = 0;
    width = '100vw';
    height = '15vh';
  }

  if (overlay) { marginTop = '-80%'; }

  return (
    <div className="tutorial-message__wrapper">
      { overlay === 'card'
        ? (
          <StaticCard
            cardName="Freighter"
            className="card card--zoomed"
            style={{ top: '60vh' }}
          />
        ) : null
      }
      <div
        className="tutorial-message__hole"
        style={{ top, left, width, height }}
      />
      <div className="tutorial-message" style={{ marginTop }}>
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
