import React from 'react';
import { useGameState } from '../GameProvider';
import ResourceIcon from '../ResourceIcon';
import './Upgrade.scss';

// TODO: refactor out some "dumb" display components that don't use context etc
function Upgrade({ cardName, friendly = false, owner, inPlay = true }) {
  const { player: { attackPool }, cards, dispatch, uiMode, setChoice } = useGameState();
  const { shields, defender, ion, labour, ore, draws } = cards.find(c => c.name === cardName);

  const ownerUpgrades = owner ? owner.inPlay.filter(s => s.mode === 'upgrade').map(s => cards.find(c => s.cardName === c.name)) : [];
  const targetable = defender || ownerUpgrades.filter(c => c.defender).length === 0;
  const destroyable = inPlay && !uiMode && !friendly && targetable && attackPool >= shields;
  const selectable = inPlay && !friendly && uiMode && uiMode.mode === 'choice' && uiMode.type === 'upgrade' && cardName !== 'Station Core';
  // TODO: would be nice to un-hardcode Station Core here somehow

  let onClick;

  if (destroyable) {
    onClick = () => dispatch({ type: 'destroy', cardName });
  } else if (selectable) {
    onClick = () => {
      uiMode.callback(cardName);
      setChoice(null);
    };
  }

  const interactable = destroyable || selectable;

  return (
    <div
      role="button"
      tabIndex="0"
      className={`upgrade ${inPlay ? '' : 'upgrade--static'} ${friendly ? '' : 'upgrade--enemy'} ${interactable ? 'upgrade--destroyable' : ''}`}
      onClick={onClick}
      title={cardName}
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

export default Upgrade;
