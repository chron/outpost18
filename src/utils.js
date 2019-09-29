import allCards from './cards';

export const resources = {
  ore: { name: 'Ore' },
  labour: { name: 'Labour' },
  ion: { name: 'Ion' },
  draws: { name: 'Draws' },
  plays: { name: 'Plays' },
};

export function findCard(state, cardName) {
  const cards = allCards[state.ruleset];

  return cards.find(c => c.name === cardName);
}

export function inPlayCardsOfType(state, inPlayCards, modes) {
  // FIXME: This ||s just to deal with the base is horrible
  return inPlayCards
    .filter(s => modes.includes(s.mode))
    .map(s => findCard(state, s.cardName) || s);
}

// TODO: move these two functions to the server-side presenter!
export function sumResourceForPlayer(state, resource, player) {
  const base = inPlayCardsOfType(state, player.inPlay, ['upgrade', 'base']);
  const ships = inPlayCardsOfType(state, player.inPlay, ['ship']);

  const baseTotal = base.reduce((total, b) => total + (b[resource] || 0), 0);
  return ships.reduce((total, s) => total + (s[`ship_${resource}`] || 0), baseTotal);
}

export function resourceTotalsForPlayer(state, player) {
  return Object.keys(resources).reduce(
    (memo, resource) => ({ ...memo, [resource]: sumResourceForPlayer(state, resource, player) }),
    {}
  );
}

export function isThresholdMet(state, threshold, owner) {
  if (!threshold) { return true; }

  if (threshold.function) {
    // If the threshold has a function, that determines whether it is passed
    return threshold.function(owner);
  } else {
    // Otherwise we're expecting an object like `{ ore: 2, labour: 1 }`
    const resourceTotals = resourceTotalsForPlayer(state, owner);

    return !Object.entries(threshold).find(([stat, amount]) => {
      if (stat === 'description') { return false; }
      return (resourceTotals[stat] || 0) < amount;
    });
  }
}
