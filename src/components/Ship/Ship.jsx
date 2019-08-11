import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import './Ship.scss';

function Ship({ playerName, cardName, attacking, canAttack }) {
  const { cards, dispatch } = useContext(GameContext);
  const { name, attack } = cards.find(c => c.name === cardName);

  return (
    <div
      className={`ship ${attacking && 'ship--attacking'} ${canAttack && 'ship--ready'}`}
      onClick={() => dispatch({ type: 'attack', playerName, cardName })}
    >
      {name}
      {attack}
    </div>
  );
}

Ship.propTypes = {
  card: PropTypes.object,
};

export default Ship;
