import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import GameContext from '../../GameContext';
import './Card.scss';

function Card({ playerName, cardName }) {
  const { currentPlayer: { plays }, cards, dispatch } = useContext(GameContext);
  const { name } = cards.find(c => c.name === cardName);

  return (
    <div className={`card ${plays > 0 ? 'playable' : ''}`} >
      <div className="card__title">
        {name}
      </div>

      <div className="card__controls">
        <button
          className="card__control"
          disabled={plays <= 0}
          onClick={() => dispatch({ type: 'play', playerName, cardName, mode: 'ship' })}
        >
          🚀
        </button>
        <button
          className="card__control"
          disabled={plays <= 0}
          onClick={() => dispatch({ type: 'play', playerName, cardName, mode: 'upgrade' })}
        >
          🏠
        </button>
      </div>
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.object,
};

export default Card;
