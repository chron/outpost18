import { loadGame } from '../lib/database';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/helpers';

export async function handler(event, _context) {
  const { playerId, gameId } = event.queryStringParameters;

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!gameId) { return renderError('GameId must be provided.'); }

  const gameState = await loadGame(gameId);

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
