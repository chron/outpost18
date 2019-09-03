import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../constants';
import Card from '../Card';
import FaceDownCard from '../FaceDownCard';
import { useGameState } from '../GameProvider';
import './DiscardPile.scss';

function DiscardPile() {
  const { gameState, myTurn, discards, dispatch } = useGameState();

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => dispatch({
      type: 'discard',
      cardNames: [item.cardName],
    }),
    canDrop: _item => gameState === 'begin' && myTurn,
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });

  const topDiscard = discards[discards.length - 1];

  return (
    <div
      ref={dropRef}
      className={`deck deck--discard ${isOver ? 'deck--hovering' : ''} ${canDrop ? 'deck--active' : ''}`}
      data-hint="Drop card here to discard it."
    >
      { topDiscard
        ? <Card cardName={topDiscard} />
        : <FaceDownCard /> // TODO: better placeholder
      }
    </div>
  );
}

export default DiscardPile;
