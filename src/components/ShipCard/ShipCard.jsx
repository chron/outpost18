import React from 'react';
import { resources } from '../../utils';

import './ShipCard.scss';

function resourceToIcons(resource, amount = 1) {
  return Array(amount).fill(1).map(() => resources[resource].icon).join('');
}

function thresholdToIcons(threshold) {
  if (!threshold) { return ''; }

  return Object.entries(threshold).map(([resource, amount]) => {
    if (resource === 'todo') { return '😱'; }
    return resourceToIcons(resource, amount);
  });
}

function effectToIcons(effect) {
  if (!effect) { return ''; }
  if (effect.description) { return effect.description; }

  return Object.entries(effect).map(([resource, amount]) => {
    if (resource === 'attack') {
      return (
        <React.Fragment key={resource}>
          +
          <span className="power">
            {Array(amount).fill(1).map(() => 'I')}
          </span>
        </React.Fragment>
      );
    }

    if (resource === 'plays') {
      return `Play +${amount} ${amount === 1 ? 'card' : 'cards'}.`;
    }

    return '😱';
  });
}

function ShipCard({ card }) {
  const { name, attack, abilities, hyperdrive, ship_ore, ship_ion, ship_labour } = card;

  let passiveAbility;

  if (hyperdrive) {
    passiveAbility = 'Hyperdrive';
  } else if (ship_ion || ship_labour || ship_ore) {
    // TODO: refactor this shipX resource nonsense

    const icons = resourceToIcons('ion', ship_ion || 0) +
      resourceToIcons('labour', ship_labour || 0) +
      resourceToIcons('ore', ship_ore || 0);

    passiveAbility = `Generates ${icons}`;
  }

  return (
    <div className="card__ship">
      <div className="card__image">
        &nbsp;
      </div>

      <div className="card__title">
        {name}
      </div>

      <div className="card__power">
        <span className="power">
          {Array(attack).fill(1).map(() => 'I')}
        </span>
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
              ❂[
              {threshold
                ? threshold.description || thresholdToIcons(threshold)
                : null
              }
              ]
              {' '}
              {effectToIcons(effect)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShipCard;
