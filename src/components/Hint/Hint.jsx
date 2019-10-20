import React from 'react';
import './Hint.scss';
import { useGameState } from '../GameProvider';
import Controls from '../Controls';
import Button from '../Button';

const CHOICE_TEXT = {
  ship: 'Choose an enemy ship',
  upgrade: 'Choose an enemy upgrade',
  card: max => (max ? `Choose up to ${max} cards to discard` : 'Choose a card to discard'),
};

// TODO: move this, also, make it better
function pluralize(number, noun) {
  return `${number} ${noun}${number === 1 ? '' : 's'}`;
}

function Hint() {
  const {
    myTurn,
    gameState,
    uiMode,
    setChoice,
    submitChoice,
    player: { plays, attackPool, globalAttackBonus }
  } = useGameState();
  let message;

  if (!myTurn) {
    message = 'Waiting for opponent...';
  } else if (gameState === 'begin') {
    message = 'Discard down to 3 cards.';
  } else if (gameState === 'main') {
    if (uiMode && uiMode.mode === 'choice') {
      const showConfirm = uiMode.max && uiMode.max > 1;

      let choiceText;

      if (uiMode.description) {
        choiceText = uiMode.description;
      } else {
        choiceText = typeof CHOICE_TEXT[uiMode.type] === 'function'
          ? CHOICE_TEXT[uiMode.type](uiMode.max)
          : CHOICE_TEXT[uiMode.type];
      }
      message = (
        <>
          <p>{choiceText}.</p>
          {showConfirm && (
            <p>
              You have selected{' '}
              {pluralize(uiMode.selected.length, uiMode.type)}.
            </p>
          )}
          <Controls>
            <Button onClick={() => setChoice(null)}>
              Cancel attack
            </Button>

            {' '}

            <Button
              onClick={() => submitChoice(null)}
            >
              Skip ability
            </Button>

            {' '}
            {showConfirm && (
              <Button
                onClick={() => submitChoice(uiMode.selected)}
              >
                Confirm
              </Button>
            )}
          </Controls>
        </>
      );
    } else if (attackPool > 0) {
      message = 'Spend your attack by clicking on the enemy base.';
    } else if (plays > 0) {
      message = 'You can drag a ship from your hand to play it.';
    } else {
      message = 'Click End Turn once you are finished.';
    }
  }

  if (!message) { return null; }

  return (
    <div className="hint">
      {message}
      {globalAttackBonus
        ? <p>Your ships have a +{globalAttackBonus} attack bonus this turn.</p>
        : null
      }
    </div>
  );
}

export default Hint;
