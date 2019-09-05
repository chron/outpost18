import shuffle from 'lodash.shuffle';
import cards from '../../logic/cards';

// TODO: should this stuff move into `/logic`?
function startGame(gameState) {
  const deck = gameState.deck.slice();

  // Player array is randomized, position 0 will be the start player.
  const players = shuffle(gameState.players).map((p, index) => (
    {
      ...p,
      plays: index === 0 ? 1 : 0,
      hand: deck.splice(0, index === 0 ? 2 : 3),
    }
  ));
  const activePlayer = players[0].playerId;

  return {
    ...gameState,
    tick: gameState.tick + 1,
    deck,
    joinCode: undefined,
    gameState: 'main',
    activePlayer,
    players,
  };
}

function generateJoinCode() {
  // TODO: ensure uniqueness via the DB index
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function initialGameState() {
  const deck = shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'));

  return {
    gameState: 'waiting',
    joinCode: generateJoinCode(),
    activePlayer: null,
    deck,
    discards: [],
    players: [],
    log: [],
    tick: 0,
  };
}

export function addPlayerToGame(gameState, playerId, playerName) {
  if (gameState.gameState !== 'waiting') { throw new Error('Game already started.'); }
  if (gameState.players.length >= 2) { throw new Error('Game full.'); }

  const players = gameState.players.concat({
    playerId,
    name: playerName,
    plays: 0,
    attackPool: 0,
    hand: [],
    effects: [],
    inPlay: [{ cardName: 'Station Core', mode: 'base' }],
  });

  if (players.length === 2) {
    return startGame({ ...gameState, players });
  } else {
    return { ...gameState, players };
  }
}
