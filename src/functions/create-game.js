/* eslint-disable consistent-return */
import shuffle from 'lodash.shuffle';
import cards from '../cards';
import { createGame } from '../database';

export function handler(event, context, callback) {
  const { playerId, playerName } = JSON.parse(event.body);

  if (!playerId || !playerName) {
    return callback('playerId and playerName must be provided');
  }

  const baseStats = { cardName: 'Station Core', mode: 'base' };
  const deck = shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'));

  const gameState = {
    gameState: 'main',
    activePlayer: playerId,
    deck,
    discards: [],
    // TODO: later we'll just load one player here and start the game in a 'waiting' state
    // TODO: randomize which player is the starting player
    players: [[playerId, playerName], ['opponent', 'opponent']].map(([id, name], i) => {
      return {
        playerId: id,
        name,
        plays: i === 0 ? 1 : 0,
        attackPool: 0,
        hand: deck.splice(0, i === 0 ? 2 : 3),
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
