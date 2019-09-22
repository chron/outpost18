import cloneDeep from 'lodash.clonedeep';
import reducer from '../../logic/reducer';
import { findCard, resourceTotalsForPlayer } from '../../utils';

function mapToCards(state, cardNames) {
  return cardNames.map(cardName => findCard(state, cardName));
}

function simulate(state, playerId, action) {
  const newState = cloneDeep(state);
  return reducer(newState, action, playerId);
}

export function readyShips(_state, player) {
  return player.inPlay
    .filter(i => i.mode === 'ship' && i.canAttack && !i.attacking)
    .map(i => i.cardName);
}

export function defenseUpgrades(state, player) {
  return mapToCards(
    state,
    player.inPlay
      .filter(i => i.mode === 'upgrade')
      .map(i => i.cardName)
  ).filter(c => c.defender);
}

function ratePlayerState(state, player, weights) {
  const playerStats = { ...player, ...resourceTotalsForPlayer(state, player) };

  return (
    (playerStats.ore || 0) * (weights.ore || 0)
    + (playerStats.ion || 0) * (weights.ion || 0)
    + (playerStats.labour || 0) * (weights.labour || 0)
    + (playerStats.draws || 0) * (weights.draws || 0)
    + (playerStats.hand.length || 0) * (weights.handSize || 0)
    + calculateLethal(state, player) * (weights.effectiveHealth || 0)
    + totalAttackNextTurn(state, player) * (weights.nextTurnAttack || 0)
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
  const simulation = readyShips(state, player).reduce((prevState, cardName) => {
    return simulate(prevState, player.playerId, { type: 'attack', cardName }); // TODO: choices
  }, state);

  const simulatedPlayer = simulation.players.find(p => p.playerId === player.playerId);
  return simulatedPlayer.attackPool;
}

export function totalAttackNextTurn(state, player) {
  const allShips = player.inPlay.filter(i => i.mode === 'ship').map(i => i.cardName);
  const allCards = mapToCards(state, allShips);
  // TODO: this doesn't do any abilities at all
  return allCards.reduce((total, c) => total + c.attack, 0);
}

// Return how much damage is needed to destroy this player.
export function calculateLethal(state, player) {
  const defenseCards = defenseUpgrades(state, player);
  const base = mapToCards(state, ['Station Core'])[0]; // TODO: un-hardcode this

  return defenseCards.map(c => c.shields).reduce((sum, n) => sum + n, base.shields);
}
