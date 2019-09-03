import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../constants';
import { useGameState } from '../GameProvider';

import './Lane.scss';

function Lane({ type, owner, children }) {
  const { dispatch, currentPlayer, activePlayer, gameState } = useGameState();

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => dispatch({
      type: 'play',
      cardName: item.cardName,
      mode: type,
    }),
    canDrop: _item => currentPlayer.playerId === activePlayer && gameState === 'main' && owner.playerId === currentPlayer.playerId && type !== 'hand',
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`lane lane--${type} ${isOver ? 'lane--hovering' : ''} ${canDrop ? 'lane--active' : ''}`}
      data-hint={`Drop card here to play it as ${type === 'ship' ? 'a ship' : 'an upgrade'}`}
    >
      { children }
    </div>
  );
}

export default Lane;
