import React from 'react';
import { useGameState } from '../GameProvider';
import { resources } from '../../utils';
import './Upgrade.scss';

// TODO: refactor out some "dumb" display components that don't use context etc
function Upgrade({ cardName, owner, inPlay = true }) {
  const { currentPlayer, cards, dispatch } = useGameState();
  const { shields, defender, ion, labour, ore, draws } = cards.find(c => c.name === cardName);

  const enemy = owner && owner.playerId !== currentPlayer.playerId;
  const ownerUpgrades = owner ? owner.inPlay.filter(s => s.mode === 'upgrade').map(s => cards.find(c => s.cardName === c.name)) : [];
  const targetable = defender || ownerUpgrades.filter(c => c.defender).length === 0
  const destroyable = enemy && targetable && currentPlayer.attackPool >= shields;

  return (
    <div
      role="button"
      tabIndex="0"
      className={`upgrade ${inPlay ? '' : 'upgrade--static'} ${enemy ? 'upgrade--enemy' : ''} ${destroyable ? 'upgrade--destroyable' : ''}`}
      onClick={() => inPlay && destroyable && dispatch({ type: 'destroy', cardName }) }
    >
      <div className={`upgrade__shields upgrade__shields--reverse ${defender ? 'upgrade__shields--defender' : ''}`}>
        {shields}
        {defender ? '!' : ''}
      </div>

      <div className="upgrade__powers">
        {Array(ion || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">{resources.ion.icon}</div>)}
        {Array(labour || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">{resources.labour.icon}</div>)}
        {Array(ore || 0).fill(1).map((_, i) => <div key={i} className="upgrade__power">{resources.ore.icon}</div>)}
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

export default Upgrade;
