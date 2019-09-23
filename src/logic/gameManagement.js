import shuffle from 'lodash.shuffle';
import allCards from '../cards';

const ACTIVE_VERSION = '2.4.1';

function startGame(gameState, noRandomness = false) {
  const deck = gameState.deck.slice();

  // Player array is randomized, position 0 will be the start player.
  // Unless it's a replay, then we just take the order we are given!
  const playerArray = noRandomness ? gameState.players : shuffle(gameState.players)
  const players = playerArray.map((p, index) => (
    {
      ...p,
      plays: index === 0 ? 1 : 0,
      hand: deck.splice(0, index === 0 ? 2 : 3),
    }
  ));
  const activePlayer = players[0].playerId;
  const startedAt = new Date().toISOString();

  return {
    ...gameState,
    startedAt,
    turnStartedAt: startedAt,
    tick: gameState.tick + 1,
    deck,
    joinCode: undefined,
    gameState: 'main',
    activePlayer,
    players,
  };
}

function generateJoinCode() {
  // TODO: deal with collisions
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// TODO: make this more sophisticated
export function validPlayerId(playerId) {
  return playerId !== 'AUTOMA';
}

export function initialGameState(publicGame, settings = {}, initialDeck = null, ruleset = null) {
  const cards = allCards[ruleset || ACTIVE_VERSION];
  const deck = initialDeck || shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'));

  // For testing you might want to force a particular card into your starting hand
  // deck = ['Helix'].concat(deck.filter(c => c.name !== 'Helix'));

  return {
    createdAt: new Date().toISOString(),
    ruleset: ACTIVE_VERSION,
    publicGame,
    settings: {
      turnLength: undefined,
      ...settings,
    },
    gameState: 'waiting',
    joinCode: generateJoinCode(),
    activePlayer: null,
    deck,
    startingDeck: deck,
    discards: [],
    players: [],
    log: [],
    tick: 0,
    turn: 1,
  };
}

export function addPlayerToGame(gameState, playerId, playerName, settings = {}, isReplay = false) {
  if (gameState.gameState !== 'waiting') { throw new Error('Game already started.'); }
  if (gameState.players.length >= 2) { throw new Error('Game full.'); }

  const players = gameState.players.concat({
    ...settings,
    playerId,
    name: playerName.slice(0, 30),
    plays: 0,
    attackPool: 0,
    hand: [],
    inPlay: [{ cardName: 'Station Core', mode: 'base' }],
    joinedAt: new Date().toISOString(),
  });

  if (players.length === 2) {
    return startGame({ ...gameState, players }, isReplay);
  } else {
    return { ...gameState, players };
  }
}

export function addAutomaToGame(gameState, aiController = 'basic') {
  const playerId = 'AUTOMA';
  const playerName = 'The Worst AI';

  return addPlayerToGame(gameState, playerId, playerName, { aiController });
}
