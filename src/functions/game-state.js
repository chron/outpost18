import { loadGame, loadActiveGame } from '../lib/database';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/apiResponses';

export async function handler(event, _context) {
  let { playerId, gameId } = event.queryStringParameters;

  if (!playerId) { return renderError('PlayerId must be provided.'); }

  let gameState;

  if (gameId) {
    gameState = await loadGame(gameId);
  } else {
    // TODO: this case could probably be its own endpoint
    [gameId, gameState] = await loadActiveGame(playerId);

    if (!gameId) {
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
