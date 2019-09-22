import { loadGame } from '../lib/database';
import replayPresenter from './utils/replayPresenter';
import { renderError } from './utils/apiResponses';

export async function handler(event, _context) {
  const { gameId } = event.queryStringParameters;
  if (!gameId) { return renderError('GameId must be provided.'); }

  const gameState = await loadGame(gameId);
  if (gameState.gameState !== 'finished') { return renderError('Game still in progress.'); }

  return {
    statusCode: 200,
    body: JSON.stringify(replayPresenter(gameState, gameId)),
  };
}
