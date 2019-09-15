import cloneDeep from 'lodash.clonedeep';
import reducer from '../../logic/reducer';
import cards from '../../logic/cards';
import { resourceTotalsForPlayer } from '../../utils';

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

function ratePlayerState(state, player, weights) {
  const playerStats = { ...player, ...resourceTotalsForPlayer(player) };

  return (
    (playerStats.ore || 0) * (weights.ore || 0)
    + (playerStats.ion || 0) * (weights.ion || 0)
    + (playerStats.labour || 0) * (weights.labour || 0)
    + (playerStats.draws || 0) * (weights.draws || 0)
    + (playerStats.hand.length || 0) * (weights.handSize || 0)
    + calculateLethal(player) * (weights.effectiveHealth || 0)
    + totalAttackNextTurn(player) * (weights.nextTurnAttack || 0)
  );
}

export function rateGameState(state, playerId, weights) {
  const player = state.players.find(p => p.playerId === playerId);
  const opponent = state.players.find(p => p.playerId !== playerId);

  return ratePlayerState(state, player, weights.player)
    + ratePlayerState(state, opponent, weights.opponent);
}

export function rateAction(state, playerId, weights, action) {
  const newState = simulate(state, playerId, action);
  return rateGameState(newState, playerId, weights);
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

export function totalAttackNextTurn(player) {
  const allShips = player.inPlay.filter(i => i.mode === 'ship').map(i => i.cardName);
  const allCards = mapToCards(allShips);
  // TODO: this doesn't do any abilities at all
  return allCards.reduce((total, c) => total + c.attack, 0);
}

// Return how much damage is needed to destroy this player.
export function calculateLethal(player) {
  const defenseCards = defenseUpgrades(player);
  const base = mapToCards(['Station Core'])[0]; // TODO: un-hardcode this

  return defenseCards.map(c => c.shields).reduce((sum, n) => sum + n, base.shields);
}
