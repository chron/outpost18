import React from 'react';
import ShipCard from '../ShipCard';
import UpgradeCard from '../UpgradeCard';
import { useGameState } from '../GameProvider';

function StaticCard({ cardName, ...otherProps }) {
  const { cards } = useGameState();
  const card = cards.find(c => c.name === cardName);

  if (!card) { return null; }

  return (
    <div className="card" {...otherProps}>
      <ShipCard card={card} />
      <UpgradeCard card={card} inPlay={false} />
    </div>
  );
}

export default StaticCard;
