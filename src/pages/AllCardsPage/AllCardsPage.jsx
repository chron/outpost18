import React, { useState } from 'react';
import queryString from 'query-string';
import ShipCard from '../../components/ShipCard';
import UpgradeCard from '../../components/UpgradeCard';
import BackBar from '../../components/BackBar';
import allCards from '../../cards';
import { ACTIVE_VERSION } from '../../constants';
import './AllCardsPage.scss';

export default function AllCardsPage({ location: { search } }) {
  const { v } = queryString.parse(search); // TODO: sync with state maybe?
  const [ruleset, setRuleset] = useState(v || ACTIVE_VERSION);

  return (
    <div className="page page--all-cards">
      {allCards[ruleset].map(card => {
        if (card.name === 'Station Core') { return null; }

        return (
          <div key={card.name} className="card">
            <ShipCard card={card} />
            <UpgradeCard card={card} inPlay={false} />
          </div>
        );
      })}

      <BackBar>
        <select value={ruleset} onChange={e => setRuleset(e.target.value)}>
          {Object.keys(allCards).map(version => (
            <option key={version} value={version}>{version}</option>
          ))}
        </select>
      </BackBar>
    </div>
  );
}
