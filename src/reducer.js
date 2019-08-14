import { sumResourceForPlayer } from './utils';
import shuffle from 'lodash.shuffle';

function lookupCard(state, cardName) {
  return state.cards.find(c => c.name === cardName);
}

function play(state, playerName, cardName, mode) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerName) { return state; }

  const playerIndex = state.players.findIndex(p => p.name === playerName);
  const player = state.players[playerIndex];

  const { hand, inPlay, plays } = player;
  const cardIndex = hand.indexOf(cardName);

  if (cardIndex < 0) { return state; }
  if (plays < 1) { return state; }

  const card = lookupCard(state, cardName);

  const newHand = hand.slice()
  newHand.splice(cardIndex, 1);
  const newPlays = plays - 1;
  const newInPlay = [...inPlay, { cardName, mode, canAttack: card.hyperdrive, attacking: false }];
  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, plays: newPlays, inPlay: newInPlay, hand: newHand };

  return { ...state, players: newPlayers };
}

function attack(state, playerName, cardName) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerName) { return state; }

  const playerIndex = state.players.findIndex(p => p.name === playerName);
  const player = state.players[playerIndex];
  const { inPlay, attackPool } = player;
  const ship = inPlay.find(s => s.cardName === cardName);

  if (!ship) { return state; }
  if (!ship.mode === 'ship') { return state; }
  if (!ship.canAttack) { return state; }
  if (ship.attacking) { return state; }

  const card = lookupCard(state, cardName);

  const shipIndex = inPlay.indexOf(ship);
  const newInPlay = inPlay.slice();
  newInPlay[shipIndex] = { ...ship, attacking: true };
  const newAttackPool = attackPool + card.attack;

  const newPlayers = state.players.slice()
  newPlayers[playerIndex] = { ...player, inPlay: newInPlay, attackPool: newAttackPool };

  return { ...state, players: newPlayers };
}

// this gets called directly by endTurn, not by an action
function beginTurn(state, playerName) {
  const player = state.players.find(p => p.name === playerName);

  const newInPlay = player.inPlay.map(i => ({ ...i, canAttack: true }));
  const changes = { plays: 1, inPlay: newInPlay };

  // TODO: discard down to 3 somehow

  let newState = updatePlayer(state, playerName, changes);
  newState = { ...newState, gameState: 'main', activePlayer: playerName };

  if (playerName === 'opponent') { // TODO: put an actual flag or something for AI
    newState = robotTurn(newState, playerName);
  }

  return newState;
}

function robotTurn(state, playerName) {
  const player = state.players.find(p => p.name === playerName);
  const cardToPlay = player.hand[0];

  let newState = state;

  if (cardToPlay) {
    newState = play(newState, playerName, cardToPlay, Math.random() < 0.5 ? 'ship' : 'upgrade');
  }

  newState = endTurn(newState, playerName);

  return newState;
}

function endTurn(state, playerName) {
  let newState = state;
  const player = state.players.find(p => p.name === playerName);

  // Move ships that attacked to the discard pile
  const attackers = player.inPlay.filter(s => s.attacking);
  const nonAttackers = player.inPlay.filter(s => !s.attacking);
  const newDiscards = state.discards.concat(attackers.map(c => c.cardName));
  newState = { ...newState, discards: newDiscards };
  newState = updatePlayer(newState, playerName, { attackPool: 0, plays: 0, inPlay: nonAttackers });

  // Draw cards equal to your draws stat
  const draws = sumResourceForPlayer(state, 'draws', player);
  newState = drawCards(newState, playerName, draws);

  // Begin turn for next player
  const opponent = state.players.find(p => p.name !== playerName);
  newState = beginTurn(newState, opponent.name);

  return newState;
}

function drawCards(state, playerName, num) {
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

  const player = newState.players.find(p => p.name === playerName);
  const newHand = player.hand.concat(cardsToDraw);
  newState = { ...newState, deck: newDeck };
  newState = updatePlayer(newState, playerName, { hand: newHand });

  return newState;
}

function updatePlayer(state, playerName, changes) {
  const playerIndex = state.players.findIndex(p => p.name === playerName);
  const player = state.players[playerIndex];

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, ...changes };

  return { ...state, players: newPlayers };
}

function destroy(state, playerName, cardName) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerName) { return state; }

  const playerIndex = state.players.findIndex(p => p.name === playerName);
  const player = state.players[playerIndex];
  const opponentIndex = state.players.findIndex(p => p.name !== playerName);
  const opponent = state.players[opponentIndex];

  const { attackPool, hand } = player;
  const { inPlay } = opponent;

  const targetIndex = inPlay.findIndex(s => s.cardName === cardName && s.mode == 'upgrade'); // TODO: or 'base'
  const target = inPlay[targetIndex]
  const card = state.cards.find(c => c.name === target.cardName);

  if (!target) { return state; }
  // defenders
  if (card.shields > attackPool) { return state; }

  const newOpponentInPlay = inPlay.slice();
  newOpponentInPlay.splice(targetIndex, 1);
  const newOpponent = { ...opponent, inPlay: newOpponentInPlay };
  const newHand = hand.concat(card.name);
  const newPlayer = { ...player, hand: newHand, attackPool: attackPool - card.shields };
  const newPlayers = [newPlayer, newOpponent] // TODO: does this mess with order? Do we care?

  return { ...state, players: newPlayers };
}

export default function reducer(state, action) {
  console.log(action);

  switch(action.type) {
    case 'play':
      return play(state, action.playerName, action.cardName, action.mode);
    case 'attack':
      return attack(state, action.playerName, action.cardName);
    case 'destroy':
      return destroy(state, action.playerName, action.cardName);
    case 'endTurn':
      return endTurn(state, action.playerName);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
