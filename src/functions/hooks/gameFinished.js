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

  const validPlayers = players.filter(p => p);

  console.log(validPlayers);

  let eloChange;
  let updatedState = gameState;

  const winner = validPlayers.find(([_, p]) => p.playerId === gameState.winner);
  const loser = validPlayers.find(([_, p]) => p.playerId !== gameState.winner);

  if (winner && loser && gameType === 'games') {
    eloChange = calculateEloChange(winner[1].games.elo, loser[1].games.elo);

    // Store the Elo score on the game object
    const oldGameData = await loadGame(gameId);
    updatedState = { ...oldGameData, eloChange };
    await saveGame(gameId, updatedState);
  }

  await Promise.all(validPlayers.map(async ([playerRef, playerData]) => {
    const won = playerData.playerId === gameState.winner;
    const newPlayerData = recordGameResult(playerData, gameType, won, eloChange);

    return savePlayer(playerRef, newPlayerData);
  }));

  if (gameState.settings.reportResult) {
    await reportFinishedGame(gameId, updatedState);
  }

  return updatedState;
}
