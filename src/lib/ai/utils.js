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

function setAllShipsReady(state, playerId) {
  const newState = cloneDeep(state);

  const player = newState.players.find(p => p.playerId === playerId);
  player.inPlay = player.inPlay.map(i => ({
    ...i,
    attacking: false,
    canAttack: true,
  }));

  return newState;
}

export function readyShips(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);

  return player.inPlay
    .filter(i => i.mode === 'ship' && i.canAttack && !i.attacking)
    .map(i => i.cardName);
}

export function defenseUpgrades(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);

  return mapToCards(
    state,
    player.inPlay
      .filter(i => i.mode === 'upgrade')
      .map(i => i.cardName)
  ).filter(c => c.defender);
}

function ratePlayerState(state, playerId, weights) {
  const player = state.players.find(p => p.playerId === playerId);
  const playerStats = { ...player, ...resourceTotalsForPlayer(state, player) };

  const values = {
    ore: playerStats.ore || 0,
    ion: playerStats.ion || 0,
    labour: playerStats.labour || 0,
    draws: playerStats.draws || 0,
    plays: playerStats.plays || 0,
    handSize: playerStats.hand.length || 0,
    effectiveHealth: calculateLethal(state, playerId),
    nextTurnAttack: totalAttackNextTurn(state, playerId),
  };

  return Object.entries(values).map(([stat, value]) => {
    const weight = weights[stat] || 0;
    return typeof weight === 'function'
      ? weight(value)
      : weight * value;
  }).reduce((s, c) => s + c);
}

export function rateGameState(state, playerId, weights) {
  const opponentId = state.players.find(p => p.playerId !== playerId).playerId;

  return ratePlayerState(state, playerId, weights.player)
    + ratePlayerState(state, opponentId, weights.opponent);
}

export function rateAction(state, playerId, weights, action) {
  const newState = simulate(state, playerId, action);
  return rateGameState(newState, playerId, weights);
}

// If we attacked with everything, how much attack could we generate total?
// (includes any attack already in the pool)
export function totalAttack(state, playerId) {
  const simulation = readyShips(state, playerId).reduce((prevState, cardName) => {
    return simulate(prevState, playerId, { type: 'attack', cardName }); // TODO: choices
  }, state);

  const simulatedPlayer = simulation.players.find(p => p.playerId === playerId);
  return simulatedPlayer.attackPool;
}

export function totalAttackNextTurn(state, playerId) {
  const nextTurnState = setAllShipsReady(state, playerId);

  return totalAttack(nextTurnState, playerId);
}

// Return how much damage is needed to destroy this player.
export function calculateLethal(state, playerId) {
  const defenseCards = defenseUpgrades(state, playerId);
  const base = mapToCards(state, ['Station Core'])[0]; // TODO: un-hardcode this

  return defenseCards.map(c => c.shields).reduce((sum, n) => sum + n, base.shields);
}
