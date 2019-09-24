import { activeGames } from './utils/lobby';
import lobbyGamePresenter from './utils/lobbyGamePresenter';

export async function handler(_event, _context) {
  const games = await activeGames();

  // Gotcha: currently no GameId is being passed but the lobby doesn't need it, so...
  return {
    statusCode: 200,
    body: JSON.stringify(games.map(g => lobbyGamePresenter(g))),
  };
}
