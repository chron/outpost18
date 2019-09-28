import React from 'react';
import classNames from 'classnames';
import ResourceIcon from '../ResourceIcon';

import './UpgradeCard.scss';


function UpgradeCard({ card, inPlay, friendly, onClick, interactable }) {
  const { name, shields, defender, draws, plays, ion, labour, ore } = card;

  return(
    <div
      role="button"
      tabIndex="0"
      className={classNames('upgrade', {
        'upgrade--vertical': inPlay,
        'upgrade--enemy': friendly,
        'upgrade--destroyable': interactable,
      })}
      onClick={onClick}
      title={name}
    >
      <div className={`upgrade__shields upgrade__shields--reverse ${defender ? 'upgrade__shields--defender' : ''}`}>
        {shields}
        {defender ? '!' : ''}
      </div>

      <div className="upgrade__powers">
        <ResourceIcon resource="ion" num={ion} />
        <ResourceIcon resource="labour" num={labour} />
        <ResourceIcon resource="ore" num={ore} />
        {defender ? <div className="upgrade__power">Def</div> : ''}
        {Array(draws || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">+<br />Draw</div>)}
        {Array(plays || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">+<br />Play</div>)}
      </div>

      <div className={`upgrade__shields ${defender ? 'upgrade__shields--defender' : ''}`}>
        {shields}
        {defender ? '!' : ''}
      </div>
    </div>
  );
}

export default UpgradeCard;
