import React from 'react';
import classNames from 'classnames';
import { isThresholdMet } from '../../utils';
import ResourceIcon from '../ResourceIcon';
import attackImage from '../../assets/images/icons/attack.png';
import * as images from '../../assets/images/ships/*.png';

import './ShipCard.scss';

function thresholdToIcons(threshold) {
  if (!threshold) { return ''; }

  return Object.entries(threshold).map(([resource, amount]) => {
    return <ResourceIcon key={resource} num={amount} resource={resource} />
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

function ShipCard({ card, owner = null }) {
  const { name, attack, abilities, hyperdrive, ship_ore, ship_ion, ship_labour } = card;

  let passiveAbility;

  if (hyperdrive) {
    passiveAbility = 'Hyperdrive';
  } else if (ship_ion || ship_labour || ship_ore) {
    // TODO: refactor this shipX resource nonsense

    passiveAbility = (
      <>
        Generates
        <ResourceIcon num={ship_ion} resource="ion" />
        <ResourceIcon num={ship_labour} resource="labour" />
        <ResourceIcon num={ship_ore} resource="ore" />
      </>
    );
  }

  return (
    <div className="card__ship">
      <div className="card__image">
        <img alt={name} src={images[name.toLowerCase()]} />
      </div>

      <div className="card__title">
        {name}
      </div>

      <div className="card__power">
        <span className="power">
          {attack === 0 ? '0' : Array(attack).fill(1).map(() => 'I')}
        </span>
      </div>

      {passiveAbility && (
        <div className="card__passive">
          {passiveAbility}
        </div>
      )}

      <div className="card__abilities">
        {abilities ? abilities.map(({ threshold, effect }, i) => {
          return (
            <div
              key={i}
              className={classNames('card__ability', {
                'card__ability--active': !owner || isThresholdMet(threshold, owner),
              })}
            >
              <img src={attackImage} className="attack-icon" alt="attack ability" />
              [
              {threshold
                ? threshold.description || thresholdToIcons(threshold)
                : null
              }
              ]
              {' '}
              {effectToIcons(effect)}
            </div>
          );
        }) : null}
      </div>
    </div>
  );
}

export default ShipCard;
