import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../constants';
import { useGameState } from '../GameProvider';
import classNames from 'classnames';

import './Lane.scss';

function Lane({ type, friendly = false, children }) {
  const { dispatch, myTurn, gameState } = useGameState();

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => dispatch({
      type: 'play',
      cardName: item.cardName,
      mode: type,
    }),
    canDrop: _item => myTurn && friendly && gameState === 'main' && type !== 'hand',
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={classNames('lane', `lane--${type}`, {
        'lane--hovering': isOver,
        'lane--active': canDrop,
        'lane--enemy': !friendly,
      })}
      data-hint={`Drop card here to play it as ${type === 'ship' ? 'a ship' : 'an upgrade'}`}
    >
      { children }
    </div>
  );
}

export default Lane;
