import { recentFinishedGames } from '../lib/database';
import lobbyGamePresenter from './utils/lobbyGamePresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(_event, _context) {
  const games = await recentFinishedGames();

  return {
    statusCode: 200,
    body: JSON.stringify(games.map(([gameId, gameState]) => lobbyGamePresenter(gameState, gameId))),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
