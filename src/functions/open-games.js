import { allPublicAndWaitingGames } from '../lib/database';
import { isPlayerActive } from '../lib/websocketServer';
import lobbyGamePresenter from './utils/lobbyGamePresenter';

const GAME_EXPIRY = 30 * 60 * 1000; // 30 minutes

export async function handler(_event, _context) {
  const games = await allPublicAndWaitingGames();

  // TODO: better way to filter out orphaned games
  const activeGames = games.filter(g => {
    const createdAt = new Date(g.createdAt).getTime();
    return new Date().getTime() - createdAt < GAME_EXPIRY;
  }).filter(g => {
    return isPlayerActive(g.players[0].playerId);
  });

  return {
    statusCode: 200,
    body: JSON.stringify(activeGames.map(g => lobbyGamePresenter(g))),
  };
}
