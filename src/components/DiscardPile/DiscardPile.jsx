import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../constants';
import Card from '../Card';
import FaceDownCard from '../FaceDownCard';
import GameContext from '../../GameContext';

import './DiscardPile.scss';

function DiscardPile() {
  const { gameState, activePlayer, currentPlayer, discards, dispatch } = useContext(GameContext);

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => dispatch({
      type: 'discard',
      cardNames: [item.cardName],
    }),
    canDrop: _item => gameState === 'begin' && currentPlayer.playerId === activePlayer,
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
