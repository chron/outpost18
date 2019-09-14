import { allPublicAndWaitingGames } from '../../lib/database';
import { isPlayerActive } from '../../lib/websocketServer';

const GAME_EXPIRY = 30 * 60 * 1000; // 30 minutes

export async function activeGames() {
  const games = await allPublicAndWaitingGames();

  // TODO: better way to filter out orphaned games
  return games.filter(g => {
    const createdAt = new Date(g.createdAt).getTime();
    return new Date().getTime() - createdAt < GAME_EXPIRY;
  }).filter(g => {
    return isPlayerActive(g.players[0].playerId);
  });
}
