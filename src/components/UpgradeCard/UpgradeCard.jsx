import React from 'react';
import classNames from 'classnames';
import { isThresholdMet } from '../../utils';
import ResourceIcon from '../ResourceIcon';
import attackImage from '../../assets/images/icons/attack.png';
import * as images from '../../assets/images/ships/*.png';

import './UpgradeCard.scss';


function UpgradeCard({ card, inPlay, friendly, onClick }) {
  const { name, shields, defender, draws, ion, labour, ore } = card;

  return(
    <div
      role="button"
      tabIndex="0"
      className={`upgrade ${inPlay ? '' : 'upgrade--static'} ${friendly ? '' : 'upgrade--enemy'} ${onClick ? 'upgrade--destroyable' : ''}`}
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
      </div>

      <div className={`upgrade__shields ${defender ? 'upgrade__shields--defender' : ''}`}>
        {shields}
        {defender ? '!' : ''}
      </div>
    </div>
  );
}

export default UpgradeCard;
