import React from 'react';
import { useDrag } from 'react-dnd';
import { useGameState } from '../GameProvider';
import { ItemTypes } from '../../constants';
import Upgrade from '../Upgrade';
import ShipCard from '../ShipCard';

import './Card.scss';

function Card({ cardName, inHand = false }) {
  const { myTurn, gameState, currentPlayer: { plays }, cards } = useGameState();

  const card = cards.find(c => c.name === cardName);
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD, cardName },
    canDrag: () => inHand && myTurn && (gameState === 'begin' || (gameState === 'main' && plays > 0)),
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      className={`card ${inHand && myTurn ? 'card--playable' : ''} ${isDragging ? 'card--dragging' : ''}`}
      ref={dragRef}
    >
      <ShipCard card={card} />
      <Upgrade cardName={cardName} inPlay={false} />
    </div>
  );
}

export default Card;
