import { loadGame } from '../lib/database';
import gameStatePresenter from './utils/gameStatePresenter';

export async function handler(event, _context) {
  const { playerId, gameId } = event.queryStringParameters;

  if (!playerId || !gameId) {
    return { statusCode: 400, body: 'playerId and gameId must be provided' };
  }

  const gameState = await loadGame(gameId);

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
