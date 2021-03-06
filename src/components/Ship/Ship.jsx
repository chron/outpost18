import React from 'react';
import { useGameState } from '../GameProvider';
import ShipCard from '../ShipCard';
import { isThresholdMet } from '../../utils';
import './Ship.scss';

function Ship({ cardName, friendly, owner, attacking, canAttack, attackAdded }) {
  const state = useGameState();

  const {
    cards,
    dispatch,
    myTurn,
    gameState,
    uiMode,
    setChoice,
    toggleSelection,
    toggleZoom,
    readonly,
  } = state;
  const card = cards.find(c => c.name === cardName);

  // TODO: this is ugly
  const availableToAttack = friendly && canAttack && !attacking && myTurn && gameState === 'main' && !uiMode;
  const availableToChoose = !friendly && uiMode && uiMode.mode === 'choice' && uiMode.type === 'ship';
  const abilityWithChoice = card.abilities.find(a => a.effect.choice && isThresholdMet(state, a.threshold, owner));

  let onClick;

  // TODO: probably this is a sign friendly and enemy ships should be two different components
  if (availableToAttack && !readonly) {
    if (abilityWithChoice) {
      const callback = (choices) => dispatch({ type: 'attack', cardName, choices });
      onClick = () => setChoice({ callback, choices: abilityWithChoice.effect.choice });
    } else {
      onClick = () => dispatch({ type: 'attack', cardName });
    }
  } else if (availableToChoose && !readonly) {
    onClick = () => toggleSelection(cardName);
  } else {
    onClick = () => toggleZoom(cardName);
  }

  const interactable = availableToChoose || availableToAttack;

  return (
    <div className="ship__wrapper">
      {attackAdded ? <div className="ship__attack-alert">+{attackAdded} attack</div> : null}
      <div
        role="button"
        tabIndex={interactable? 0 : null}
        className={`ship ${attacking ? 'ship--attacking' : ''} ${interactable ? 'ship--ready' : ''} ${friendly ? '' : 'ship--enemy'}`}
        onClick={onClick}
      >
        <ShipCard card={card} owner={owner} state={state} />
      </div>
    </div>
  );
}

export default Ship;
