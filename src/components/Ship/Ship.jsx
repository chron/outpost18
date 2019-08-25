import React, { useContext } from 'react';
import GameContext from '../../GameContext';
import ShipCard from '../ShipCard';

import './Ship.scss';

function Ship({ cardName, owner, attacking, canAttack }) {
  const { cards, dispatch, currentPlayer } = useContext(GameContext);
  const card = cards.find(c => c.name === cardName);
  const enemy = owner.playerId !== currentPlayer.playerId;

  return (
    <div
      role="button"
      tabIndex="0"
      className={`ship ${attacking ? 'ship--attacking' : ''} ${canAttack && !enemy ? 'ship--ready' : ''} ${enemy ? 'ship--enemy' : ''}`}
      onClick={() => !enemy && canAttack && !attacking && dispatch({ type: 'attack', cardName })}
    >
      <ShipCard card={card} />
    </div>
  );
}

export default Ship;
