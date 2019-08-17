/* eslint-disable consistent-return */
import { loadGame } from '../database';

export function handler(event, _context, callback) {
  const { playerId, gameId } = event.queryStringParameters;

  if (!playerId || !gameId) {
    return callback('playerId and gameId must be provided');
  }

  loadGame(gameId).then(gameState => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ ...gameState, gameId }),
    });
  });
}
