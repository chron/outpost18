import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../constants';
import GameContext from '../../GameContext';

import './Lane.scss';

function Lane({ type, owner, children }) {
  const { dispatch, currentPlayer } = useContext(GameContext);

  const [{ canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => dispatch({
      type: 'play',
      cardName: item.cardName,
      mode: type,
    }),
    canDrop: item => owner.playerId === currentPlayer.playerId && type !== 'hand',
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div ref={dropRef} className={`lane lane--${type} ${canDrop ? 'lane--active' : ''}`}>
      { children }
    </div>
  );
}

export default Lane;
