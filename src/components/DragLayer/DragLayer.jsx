import React from 'react';
import { useDragLayer } from 'react-dnd';
import ShipCard from '../../components/ShipCard';
import UpgradeCard from '../../components/UpgradeCard';
import cards from '../../logic/cards';
import './DragLayer.scss';

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
  };
}

function DragLayer() {
  const {
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) { return null; }

  const card = cards.find(c => c.name === item.cardName);

  if (!card) { return null; }

  return (
    <div className="drag-layer">
      <div className="card " style={getItemStyles(initialOffset, currentOffset)}>
        <ShipCard card={card} />
        <UpgradeCard card={card} inPlay={false} />
      </div>
    </div>
  );
}

export default DragLayer;
