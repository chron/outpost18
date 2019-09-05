import React from 'react';
import classNames from 'classnames';
import { useDrag } from 'react-dnd';
import { useGameState } from '../GameProvider';
import { ItemTypes } from '../../constants';
import Upgrade from '../Upgrade';
import ShipCard from '../ShipCard';

import './Card.scss';

function Card({ cardName, inHand = false }) {
  const { myTurn, gameState, uiMode, toggleSelection, currentPlayer: { plays }, cards } = useGameState();

  const card = cards.find(c => c.name === cardName);
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD, cardName },
    canDrag: () => inHand && myTurn && !uiMode && (gameState === 'begin' || (gameState === 'main' && plays > 0)),
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const selectable = uiMode && uiMode.type === 'card' && (uiMode.selected.includes(cardName) || uiMode.selected.length < uiMode.max);

  let onClick;
  if (selectable) {
    onClick = () => { toggleSelection(cardName); };
  }

  return (
    <div
      className={classNames('card', {
        'card--playable': inHand && myTurn && !uiMode,
        'card--dragging': isDragging,
        'card--selectable': selectable,
        'card--selected': uiMode && uiMode.type === 'card' && uiMode.selected.includes(cardName),
      })}
      ref={dragRef}
      onClick={onClick}
    >
      <ShipCard card={card} />
      <Upgrade cardName={cardName} inPlay={false} />
    </div>
  );
}

export default Card;
