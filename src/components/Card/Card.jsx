import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import { resources } from '../../utils';

import './Card.scss';

function thresholdToIcons(threshold) {
  if (!threshold) { return ''; }

  return Object.entries(threshold).map(([resource, amount]) => {
    if (resource === 'todo') { return '😱'; }
    return resourceToIcons(resource, amount);
  }).join(' ');
}

function effectToIcons(effect) {
  if (!effect) { return ''; }

  return '=>'; // TODO
}

function resourceToIcons(resource, amount = 1) {
  return Array(amount).fill(1).map(() => resources[resource].icon).join(' ');
}

function Card({ cardName }) {
  const { currentPlayer: { plays }, cards, dispatch } = useContext(GameContext);
  const { name, attack, abilities, hyperdrive, shipOre, shipIon, shipLabour } = cards.find(c => c.name === cardName);

  let passiveAbility;

  if (hyperdrive) {
    passiveAbility = 'Hyperdrive';
  } else if (shipIon || shipLabour || shipOre) {
    // TODO: refactor this shipX resource nonsense

    const icons = resourceToIcons('ion', shipIon || 0) +
      resourceToIcons('labour', shipLabour || 0) +
      resourceToIcons('ore', shipOre || 0);

    passiveAbility = `Generates ${icons}`;
  }

  return (
    <div className={`card ${plays > 0 ? 'playable' : ''}`} tabIndex={1}>
      <div className="card__ship">
        <div className="card__image">
          &nbsp;
        </div>

        <div className="card__title">
          {name}
        </div>

        <div className="card__power">
          {Array(attack).fill(1).map(() => 'I')}
        </div>

        {passiveAbility && (
          <div className="card__passive">
            {passiveAbility}
          </div>
        )}

        <div className="card__abilities">
          {abilities.map(({ threshold, effect }, i) => {
            return (
              <div key={i}>
                ❂[ {thresholdToIcons(threshold)} ] {effectToIcons(effect)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card__controls">
        <button
          className="card__control"
          disabled={plays <= 0}
          onClick={() => dispatch({ type: 'play', cardName, mode: 'ship' })}
        >
          🚀
        </button>
        <button
          className="card__control"
          disabled={plays <= 0}
          onClick={() => dispatch({ type: 'play', cardName, mode: 'upgrade' })}
        >
          🏠
        </button>
      </div>
    </div>
  );
}

export default Card;
