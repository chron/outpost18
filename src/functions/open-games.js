import { activeGames } from './utils/lobby';
import lobbyGamePresenter from './utils/lobbyGamePresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(_event, _context) {
  const games = await activeGames();

  // Gotcha: currently no GameId is being passed but the lobby doesn't need it, so...
  return {
    statusCode: 200,
    body: JSON.stringify(games.map(g => lobbyGamePresenter(g))),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
