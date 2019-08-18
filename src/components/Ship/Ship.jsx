import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import ShipCard from '../ShipCard';

import './Ship.scss';

function Ship({ cardName, owner, attacking, canAttack }) {
  const { cards, dispatch, currentPlayer } = useContext(GameContext);
  const card = cards.find(c => c.name === cardName);
  const enemy = owner.playerId !== currentPlayer.playerId;

  return (
    <div
      className={`ship ${attacking ? 'ship--attacking' : ''} ${canAttack && !enemy ? 'ship--ready' : ''} ${enemy ? 'ship--enemy' : ''}`}
      onClick={() => !enemy && canAttack && !attacking && dispatch({ type: 'attack', cardName })}
    >
      <ShipCard card={card} />
    </div>
  );
}

Ship.propTypes = {
  card: PropTypes.object,
};

export default Ship;
