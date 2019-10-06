import { reportFinishedGame } from '../../lib/discordWebhooks';
import { recordGameResult } from '../../logic/playerManagement';
import { loadPlayer, savePlayer } from '../../lib/database';
import { reportError } from '../../lib/errorHandling';

export default async function gameFinished(gameId, gameState) {
  if (gameState.settings.reportResult) {
    await reportFinishedGame(gameId, gameState);
  }

  const aiGame = gameState.players.some(p => p.aiController);
  const publicGame = gameState.public;
  const gameType = aiGame ? 'aiGames' : (publicGame ? 'games' : 'privateGames');

  // TODO: Do the map first to get the player data so we can pass people info about
  // their opponent as well.  This will be needed for calculating Elo.

  await Promise.all(gameState.players.map(async player => {
    if (!player.playerId.match(/-/)) { return; } // Ignore guest users, this is way too ghetto

    const [playerRef, playerData] = await loadPlayer(player.playerId);

    if (!playerRef || !playerData) {
      reportError(`Failed to find data for playerId=${player.playerId}`);
      return;
    }

    const won = player.playerId === gameState.winner;
    const newPlayerData = recordGameResult(playerData, gameType, won);
    await savePlayer(playerRef, newPlayerData);
  }));
}
