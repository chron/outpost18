import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import GameContext from '../../GameContext';
import { ItemTypes } from '../../constants';
import Upgrade from '../Upgrade';
import ShipCard from '../ShipCard';

import './Card.scss';

function Card({ cardName, inHand = false }) {
  const { activePlayer, gameState, currentPlayer: { playerId, plays }, cards } = useContext(GameContext);

  const card = cards.find(c => c.name === cardName);
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD, cardName },
    canDrag: () => inHand && activePlayer === playerId && (gameState === 'begin' || (gameState === 'main' && plays > 0)),
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      className={`card ${inHand && plays > 0 ? 'card--playable' : ''} ${isDragging ? 'card--dragging' : ''}`}
      ref={dragRef}
    >
      <ShipCard card={card} />
      <Upgrade cardName={cardName} inPlay={false} />
    </div>
  );
}

export default Card;
