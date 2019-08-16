import shuffle from 'lodash.shuffle';
import cards from '../cards';
import { createGame } from '../database';

export function handler(event, context, callback) {
  const baseStats = { cardName: 'Station Core', mode: 'base' };
  const deck = shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'));

  const gameState = {
    gameState: 'main',
    activePlayer: 'me',
    deck,
    discards: [],
    players: ['me', 'opponent'].map(name => {
      return {
        name,
        plays: name === 'me' ? 1 : 0,
        attackPool: 0,
        hand: deck.splice(0, name === 'me' ? 2 : 3),
        inPlay: [{ ...baseStats }],
      };
    }),
  };

  createGame(gameState).then(gameId => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ ...gameState, gameId }),
    });
  });
}
