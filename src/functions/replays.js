import { recentFinishedGames } from '../lib/database';
import lobbyGamePresenter from './utils/lobbyGamePresenter';

export async function handler(_event, _context) {
  const games = await recentFinishedGames();

  return {
    statusCode: 200,
    body: JSON.stringify(games.map(([gameId, gameState]) => lobbyGamePresenter(gameState, gameId))),
  };
}
