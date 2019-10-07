import { reportFinishedGame } from '../../lib/discordWebhooks';
import { recordGameResult } from '../../logic/playerManagement';
import { loadPlayer, savePlayer } from '../../lib/database';
import { reportError } from '../../lib/errorHandling';

export default async function gameFinished(gameId, gameState) {
  if (gameState.settings.reportResult) {
    await reportFinishedGame(gameId, gameState);
  }

  const aiGame = gameState.players.some(p => p.aiController);
  const gameType = aiGame ? 'aiGames' : (gameState.publicGame ? 'games' : 'privateGames');

  const players = await Promise.all(gameState.players.map(async player => {
    if (!player.playerId.match(/-/)) { return; } // Ignore guest users, this is way too ghetto

    return loadPlayer(player.playerId);
  }));

  await Promise.all(players.map(async ([playerRef, playerData]) => {
    if (!playerRef) { return; }

    const won = playerData.playerId === gameState.winner;
    const [, opponent] = players.find(([pr, _]) => pr !== playerRef);
    const newPlayerData = recordGameResult(playerData, gameType, won, opponent);

    return savePlayer(playerRef, newPlayerData);
  }));
}
