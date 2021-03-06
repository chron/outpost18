import { loadGame } from '../lib/database';
import replayPresenter from './utils/replayPresenter';
import { renderError } from './utils/apiResponses';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(event, _context) {
  const { gameId } = event.queryStringParameters;
  if (!gameId) { return renderError('GameId must be provided.'); }

  const gameState = await loadGame(gameId);

  if (gameState === null) { return renderError('That GameId could not be found.'); }
  if (gameState.gameState !== 'finished') { return renderError('Game still in progress.'); }

  return {
    statusCode: 200,
    body: JSON.stringify(replayPresenter(gameState, gameId)),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
