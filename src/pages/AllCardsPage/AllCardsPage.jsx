import React from 'react';
import queryString from 'query-string';
import ShipCard from '../../components/ShipCard';
import UpgradeCard from '../../components/UpgradeCard';
import BackBar from '../../components/BackBar';
import allCards from '../../cards';
import { ACTIVE_VERSION } from '../../constants';
import './AllCardsPage.scss';

export default function AllCardsPage({ location: { search } }) {
  const { v } = queryString.parse(search);

  return (
    <div className="page page--all-cards">
      {allCards[v || ACTIVE_VERSION].map(card => {
        if (card.name === 'Station Core') { return null; }

        return (
          <div key={card.name} className="card">
            <ShipCard card={card} />
            <UpgradeCard card={card} inPlay={false} />
          </div>
        );
      })}

      <BackBar />
    </div>
  );
}
