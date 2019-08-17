import { resourceTotalsForPlayer, sumResourceForPlayer } from './utils';
import cards from './cards';
import shuffle from 'lodash.shuffle';

function lookupCard(cardName) {
  return cards.find(c => c.name === cardName);
}

function play(state, playerId, cardName, mode) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];

  const { hand, inPlay, plays } = player;
  const cardIndex = hand.indexOf(cardName);

  if (cardIndex < 0) { return state; }
  if (plays < 1) { return state; }

  const card = lookupCard(cardName);

  const newHand = hand.slice()
  newHand.splice(cardIndex, 1);
  const newPlays = plays - 1;
  const newInPlay = [...inPlay, { cardName, mode, canAttack: card.hyperdrive, attacking: false }];
  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, plays: newPlays, inPlay: newInPlay, hand: newHand };

  return { ...state, players: newPlayers };
}

function attack(state, playerId, cardName) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];
  const { inPlay, attackPool } = player;
  const ship = inPlay.find(s => s.cardName === cardName);

  if (!ship) { return state; }
  if (!ship.mode === 'ship') { return state; }
  if (!ship.canAttack) { return state; }
  if (ship.attacking) { return state; }

  const card = lookupCard(cardName);

  const shipIndex = inPlay.indexOf(ship);
  const newInPlay = inPlay.slice();
  newInPlay[shipIndex] = { ...ship, attacking: true };
  const newAttackPool = attackPool + card.attack;
  let newPlayer = { ...player, inPlay: newInPlay, attackPool: newAttackPool };

  // Possible gotcha: checking here assumes these totals won't change as a result of
  // activating attack abilities (currently true)
  const resourceTotals = resourceTotalsForPlayer(player);

  // Check and apply the ship's attack abilities
  card.abilities.forEach(({ threshold, effect }) => {
    if (threshold.todo) { console.warn('TODO threshold'); return; }

    const failedThreshold = Object.entries(threshold).find(([stat, amount]) => {
      return (resourceTotals[stat] || 0) < amount;
    });

    if (failedThreshold) { return; }

    if(effect.todo) { console.warn('TODO effect'); return; }

    Object.entries(effect).forEach(([stat, amount]) => {
      newPlayer[stat === 'attack' ? 'attackPool' : stat] += amount;
    });
  });

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = newPlayer;
  return { ...state, players: newPlayers };
}

// this gets called directly by endTurn, not by an action
function beginTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);

  const newInPlay = player.inPlay.map(i => ({ ...i, canAttack: true }));
  const changes = { plays: 1, inPlay: newInPlay };

  // TODO: discard down to 3 somehow

  let newState = updatePlayer(state, playerId, changes);
  newState = { ...newState, gameState: 'main', activePlayer: playerId };

  if (playerId === 'opponent') { // TODO: put an actual flag or something for AI
    newState = robotTurn(newState, playerId);
  }

  return newState;
}

function robotTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);
  const cardToPlay = player.hand[0];

  let newState = state;

  if (cardToPlay) {
    newState = play(newState, playerId, cardToPlay, Math.random() < 0.5 ? 'ship' : 'upgrade');
  }

  newState = endTurn(newState, playerId);

  return newState;
}

function endTurn(state, playerId) {
  let newState = state;
  const player = state.players.find(p => p.playerId === playerId);

  // Move ships that attacked to the discard pile
  const attackers = player.inPlay.filter(s => s.attacking);
  const nonAttackers = player.inPlay.filter(s => !s.attacking);
  const newDiscards = state.discards.concat(attackers.map(c => c.cardName));
  newState = { ...newState, discards: newDiscards };
  newState = updatePlayer(newState, playerId, { attackPool: 0, plays: 0, inPlay: nonAttackers });

  // Draw cards equal to your draws stat
  const draws = sumResourceForPlayer('draws', player);
  newState = drawCards(newState, playerId, draws);

  // Begin turn for next player
  const opponent = state.players.find(p => p.playerId !== playerId);
  newState = beginTurn(newState, opponent.playerId);

  return newState;
}

function drawCards(state, playerId, num) {
  let newState = state;
  let newDeck = newState.deck.slice();
  let cardsToDraw = newDeck.splice(0, num);

  if (cardsToDraw.length < num) {
    // If the deck is empty, shuffle discards to make a new deck
    // TODO: store PRNG seed so this can be reproduced
    newDeck = newDeck.concat(shuffle(state.discards));
    cardsToDraw = cardsToDraw.concat(newDeck.splice(0, num));
    newState = { ...newState, discards: [] };
  }

  const player = newState.players.find(p => p.playerId === playerId);
  const newHand = player.hand.concat(cardsToDraw);
  newState = { ...newState, deck: newDeck };
  newState = updatePlayer(newState, playerId, { hand: newHand });

  return newState;
}

function updatePlayer(state, playerId, changes) {
  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, ...changes };

  return { ...state, players: newPlayers };
}

function destroy(state, playerId, cardName) {
  const { gameState, activePlayer, players } = state;

  if (gameState !== 'main') { return state; }
  if (activePlayer !== playerId) { return state; }

  const playerIndex = players.findIndex(p => p.playerId === playerId);
  const player = players[playerIndex];
  const opponentIndex = players.findIndex(p => p.playerId !== playerId);
  const opponent = players[opponentIndex];

  const { attackPool, hand } = player;
  const { inPlay } = opponent;

  const targetIndex = inPlay.findIndex(s => s.cardName === cardName && ['upgrade', 'base'].includes(s.mode));
  const target = inPlay[targetIndex]
  const card = lookupCard(cardName);
  const defenders = inPlay
    .filter(s => s.mode === 'upgrade')
    .map(s => cards.find(c => s.cardName === c.name))
    .filter(c => c.defender);

  if (!target) { return state; }
  if (card.shields > attackPool) { return state; }
  if (!card.defender && defenders.length > 0) { return state; }

  if (card.name === 'Station Core') {
    return { ...state, gameState: 'finished' };
  } else {
    const newOpponentInPlay = inPlay.slice();
    newOpponentInPlay.splice(targetIndex, 1);
    const newOpponent = { ...opponent, inPlay: newOpponentInPlay };
    const newHand = hand.concat(card.name);
    const newPlayer = { ...player, hand: newHand, attackPool: attackPool - card.shields };
    const newPlayers = [newPlayer, newOpponent] // TODO: does this mess with order? Do we care?

    return { ...state, players: newPlayers };
  }
}

export default function reducer(state, action, playerId) {
  switch(action.type) {
    case 'play':
      return play(state, playerId, action.cardName, action.mode);
    case 'attack':
      return attack(state, playerId, action.cardName);
    case 'destroy':
      return destroy(state, playerId, action.cardName);
    case 'endTurn':
      return endTurn(state, playerId);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
