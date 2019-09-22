import React from 'react';
import ShipCard from '../ShipCard';
import UpgradeCard from '../UpgradeCard';
import cards from '../../logic/cards';

function StaticCard({ cardName, ...otherProps }) {
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
