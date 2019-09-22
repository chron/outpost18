import React from 'react';
import './Hint.scss';
import { useGameState } from '../GameProvider';

const CHOICE_TEXT = {
  ship: 'an enemy ship',
  upgrade: 'an enemy upgrade',
  card: max => (max ? `up to ${max} cards to discard` : 'a card to discard'),
};

// TODO: move this, also, make it better
function pluralize(number, noun) {
  return `${number} ${noun}${number === 1 ? '' : 's'}`;
}

function Hint() {
  const { myTurn, gameState, uiMode, setChoice, player: { plays, attackPool, globalAttackBonus } } = useGameState();
  let message;

  if (!myTurn) {
    message = 'Waiting for opponent...';
  } else if (gameState === 'begin') {
    message = 'Discard down to 3 cards.';
  } else if (gameState === 'main') {
    if (uiMode) {
      const showConfirm = uiMode.max && uiMode.max > 1;
      const choiceText = typeof CHOICE_TEXT[uiMode.type] === 'function'
        ? CHOICE_TEXT[uiMode.type](uiMode.max)
        : CHOICE_TEXT[uiMode.type];

      message = (
        <>
          <p>Choose {choiceText}.</p>
          {showConfirm && (
            <p>
              You have selected{' '}
              {pluralize(uiMode.selected.length, uiMode.type)}.
            </p>
          )}
          <p>
            <a
              className="hint--link"
              onClick={() => setChoice(null)}
            >
              Cancel attack
            </a>
            {' '}
            {showConfirm && (
              <a
                className="hint--link"
                onClick={() => {
                  uiMode.callback(uiMode.selected);
                  setChoice(null);
                }}
              >
                Confirm
              </a>
            )}
          </p>
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
