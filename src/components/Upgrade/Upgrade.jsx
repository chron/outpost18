import React from 'react';
import { useGameState } from '../GameProvider';
import ResourceIcon from '../ResourceIcon';
import './Upgrade.scss';
import UpgradeCard from '../UpgradeCard';

// TODO: refactor out some "dumb" display components that don't use context etc
function Upgrade({ cardName, friendly = false, owner, inPlay = true }) {
  const { player, cards, dispatch, uiMode, setChoice } = useGameState();
  const card = cards.find(c => c.name === cardName);
  const { shields, defender } = card;

  const ownerUpgrades = owner ? owner.inPlay.filter(s => s.mode === 'upgrade').map(s => cards.find(c => s.cardName === c.name)) : [];
  const targetable = defender || ownerUpgrades.filter(c => c.defender).length === 0;
  const destroyable = inPlay && !uiMode && !friendly && targetable && player.attackPool >= shields;
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

  return (
    <UpgradeCard
      card={card}
      inPlay={inPlay}
      friendly={friendly}
      onClick={onClick}
    />
  );
}

export default Upgrade;
