import React from 'react';
import './AllCardsPage.scss';
import ShipCard from '../../components/ShipCard';
import UpgradeCard from '../../components/UpgradeCard';
import allCards from '../../cards';
import { ACTIVE_VERSION } from '../../constants';

export default function AllCardsPage() {
  return (
    <div className="page page--all-cards">
      {allCards[ACTIVE_VERSION].map(card => {
        if (card.name === 'Station Core') { return null; }

        return (
          <div key={card.name} className="card">
            <ShipCard card={card} />
            <UpgradeCard card={card} inPlay={false} />
          </div>
        );
      })}
    </div>
  );
}
