import React from 'react';
import { useDragLayer } from 'react-dnd';
import StaticCard from '../StaticCard';
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

  return (
    <div className="drag-layer">
      <StaticCard cardName={item.cardName} style={getItemStyles(initialOffset, currentOffset)} />
    </div>
  );
}

export default DragLayer;
