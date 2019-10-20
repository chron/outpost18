import { recentFinishedGames, recentFinishedGamesForPlayer } from '../lib/database';
import lobbyGamePresenter from './utils/lobbyGamePresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(event, _context) {
  const { playerId } = event.queryStringParameters;

  const games = playerId
    ? await recentFinishedGamesForPlayer(playerId)
    : await recentFinishedGames();

  return {
    statusCode: 200,
    body: JSON.stringify(games.map(([gameId, gameState]) => lobbyGamePresenter(gameState, gameId))),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
