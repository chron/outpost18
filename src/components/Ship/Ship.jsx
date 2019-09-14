import React from 'react';
import { useGameState } from '../GameProvider';
import ShipCard from '../ShipCard';
import { isThresholdMet } from '../../utils';
import './Ship.scss';

function Ship({ cardName, owner, friendly = false, attacking, canAttack }) {
  const { cards, dispatch, myTurn, gameState, uiMode, setChoice } = useGameState();
  const card = cards.find(c => c.name === cardName);

  // TODO: this is ugly
  const availableToAttack = friendly && canAttack && !attacking && myTurn && gameState === 'main' && !uiMode;
  const availableToChoose = !friendly && uiMode && uiMode.mode === 'choice' && uiMode.type === 'ship';

  const abilityWithChoice = card.abilities.find(a => a.effect.choice && isThresholdMet(a.threshold, owner));

  let onClick;

  // TODO: probably this is a sign friendly and enemy ships should be two different components
  if (availableToAttack) {
    if (abilityWithChoice) {
      const callback = (choices) => dispatch({ type: 'attack', cardName, choices });
      onClick = () => setChoice({ callback, ...abilityWithChoice.effect.choice });
    } else {
      onClick = () => dispatch({ type: 'attack', cardName });
    }
  } else if (availableToChoose) {
    onClick = () => {
      uiMode.callback(cardName);
      setChoice(null);
    };
  }

  const interactable = availableToChoose || availableToAttack;

  return (
    <div
      role="button"
      tabIndex={interactable? 0 : null}
      className={`ship ${attacking ? 'ship--attacking' : ''} ${interactable ? 'ship--ready' : ''} ${friendly ? '' : 'ship--enemy'}`}
      onClick={onClick}
    >
      <ShipCard card={card} owner={owner} />
    </div>
  );
}

export default Ship;
