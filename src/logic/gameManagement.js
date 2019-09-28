import { shuffle } from 'shuffle-seed';
import allCards from '../cards';
import { ACTIVE_VERSION } from '../constants';

function startGame(gameState, noShuffle = false) {
  const deck = gameState.deck.slice();

  // Player array is randomized, position 0 will be the start player.
  // Unless it's a replay, then we just take the order we are given!
  const playerArray = noShuffle
    ? gameState.players // Because we are using the ALREADY SHUFFLED final array in this case
    : shuffle(gameState.players, `${gameState.seed}_playerorder`);

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

function generateSeed() {
  return Math.random().toString(36).substring(2);
}

// TODO: make this more sophisticated
export function validPlayerId(playerId) {
  return playerId !== 'AUTOMA';
}

export function initialGameState(publicGame, settings = {}, ruleset = null, existingSeed = null) {
  const cards = allCards[ruleset || ACTIVE_VERSION];
  const seed = existingSeed || generateSeed();
  const deck = shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'), `${seed}_startingdeck`);

  // For testing you might want to force a particular card into your starting hand
  // deck = ['Sparkwraith'].concat(deck.filter(c => c.name !== 'Sparkwraith'));

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
    discards: [],
    players: [],
    log: [],
    tick: 0,
    turn: 1,
    seed,
  };
}

export function addPlayerToGame(gameState, playerId, playerName, settings = {}, noShuffle = false) {
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
    return startGame({ ...gameState, players }, noShuffle);
  } else {
    return { ...gameState, players };
  }
}

export function addAutomaToGame(gameState, aiController = 'basic') {
  const playerId = 'AUTOMA';
  const playerName = 'The Worst AI';

  return addPlayerToGame(gameState, playerId, playerName, { aiController });
}
