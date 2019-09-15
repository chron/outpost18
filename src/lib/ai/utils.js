import cloneDeep from 'lodash.clonedeep';
import reducer from '../../logic/reducer';
import cards from '../../logic/cards';

function mapToCards(cardNames) {
  return cardNames.map(name => cards.find(c => c.name === name));
}

function simulate(state, playerId, action) {
  const newState = cloneDeep(state);
  return reducer(newState, action, playerId);
}

export function readyShips(player) {
  return player.inPlay
    .filter(i => i.mode === 'ship' && i.canAttack && !i.attacking)
    .map(i => i.cardName);
}

export function defenseUpgrades(player) {
  return mapToCards(
    player.inPlay
      .filter(i => i.mode === 'upgrade')
      .map(i => i.cardName)
  ).filter(c => c.defender);
}

// If we attacked with everything, how much attack could we generate total?
// (includes any attack already in the pool)
export function totalAttack(state, player) {
  const simulation = readyShips(player).reduce((prevState, cardName) => {
    return simulate(prevState, player.playerId, { type: 'attack', cardName }); // TODO: choices
  }, state);

  const simulatedPlayer = simulation.players.find(p => p.playerId === player.playerId);
  return simulatedPlayer.attackPool;
}

// Return how much damage is needed to destroy this player.
export function calculateLethal(player) {
  const defenseCards = defenseUpgrades(player);
  const base = mapToCards(['Station Core'])[0]; // TODO: un-hardcode this

  return defenseCards.map(c => c.shields).reduce((sum, n) => sum + n, base.shields);
}
