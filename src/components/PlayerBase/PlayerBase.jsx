import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Base from '../Base';
import Upgrade from '../Upgrade';

export default function PlayerBase({ player, friendly }) {
  const upgrades = player.inPlay.filter(s => s.mode === 'upgrade');

  return (
    <>
      <TransitionGroup component={null}>
        {upgrades.map(({ cardName }) => (
          <CSSTransition key={cardName} classNames="upgrade-" timeout={400}>
            <Upgrade
              friendly={friendly}
              owner={player}
              cardName={cardName}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      <Base owner={player} />
    </>
  );
}
