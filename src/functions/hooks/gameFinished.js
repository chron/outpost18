import { reportFinishedGame } from '../../lib/discordWebhooks';
import { recordGameResult } from '../../logic/playerManagement';
import { loadGame, saveGame, loadPlayer, savePlayer } from '../../lib/database';
import calculateEloChange from '../../lib/calculateEloChange';

export default async function gameFinished(gameId, gameState) {
  const aiGame = gameState.players.some(p => p.aiController);
  const gameType = aiGame ? 'aiGames' : (gameState.publicGame ? 'games' : 'privateGames');

  const players = await Promise.all(gameState.players.map(async player => {
    if (!player.playerId.match(/-/)) { return; } // Ignore guest users, this is way too ghetto

    return loadPlayer(player.playerId);
  }));

  let eloChange;
  let updatedState = gameState;

  const [_p1, winner] = players.find(([_, p]) => p.playerId === gameState.winner);
  const [_p2, loser] = players.find(([_, p]) => p.playerId !== gameState.winner);

  if (gameType === 'games') {
    eloChange = calculateEloChange(winner.games.elo, loser.games.elo);

    // Store the Elo score on the game object
    const oldGameData = await loadGame(gameId);
    updatedState = { ...oldGameData, eloChange };
    await saveGame(gameId, updatedState);
  }

  await Promise.all(players.map(async ([playerRef, playerData]) => {
    if (!playerRef) { return; }

    const won = playerData.playerId === gameState.winner;
    const newPlayerData = recordGameResult(playerData, gameType, won, eloChange);

    return savePlayer(playerRef, newPlayerData);
  }));

  if (gameState.settings.reportResult) {
    await reportFinishedGame(gameId, updatedState);
  }

  return updatedState;
}
