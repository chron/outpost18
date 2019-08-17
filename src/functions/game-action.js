/* eslint-disable consistent-return */
import { loadGame, saveGame } from '../database';
import reducer from '../logic/reducer';

export function handler(event, _context, callback) {
  const { playerId, gameId, action } = JSON.parse(event.body);

  if (!playerId || !gameId || !action) {
    return callback('playerId, gameId and action must be provided');
  }

  loadGame(gameId)
    .then(gameState => reducer(gameState, action, playerId))
    .then(newState => saveGame(gameId, newState))
    .then(newState => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ ...newState, gameId }),
      });
    });
}
