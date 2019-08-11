import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import './Card.scss';

function Card({ playerName, cardName }) {
  const { currentPlayer: { plays }, cards, dispatch } = useContext(GameContext);
  const { name } = cards.find(c => c.name === cardName);

  return (
    <div className="card" >
      {name}

      <div className="card__controls">
        <button
          className="card__control"
          disabled={plays <= 0}
          onClick={() => dispatch({ type: 'play', playerName, cardName, mode: 'ship' })}
        >
          Ship
        </button>
        <button
          className="card__control"
          disabled={plays <= 0}
          onClick={() => dispatch({ type: 'play', playerName, cardName, mode: 'upgrade' })}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.object,
};

export default Card;
