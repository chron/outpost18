import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import ShipCard from '../ShipCard';

import './Ship.scss';

function Ship({ cardName, owner, attacking, canAttack }) {
  const { cards, dispatch, currentPlayer, myTurn, gameState } = useContext(GameContext);
  const card = cards.find(c => c.name === cardName);
  const enemy = owner.playerId !== currentPlayer.playerId;

  const attackActive = !enemy && canAttack && myTurn && gameState === 'main';

  return (
    <div
      role="button"
      tabIndex={attackActive ? 0 : null}
      className={`ship ${attacking ? 'ship--attacking' : ''} ${attackActive ? 'ship--ready' : ''} ${enemy ? 'ship--enemy' : ''}`}
      onClick={() => attackActive && !attacking && dispatch({ type: 'attack', cardName })}
    >
      <ShipCard card={card} />
    </div>
  );
}

export default Ship;
