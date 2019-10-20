import { recordGameResult } from '../../logic/playerManagement';
import { currentSeason, initialSeasonData } from '../../logic/seasonManagement';
import { loadPlayer, savePlayer } from '../../lib/database';
import calculateEloChange from '../../lib/calculateEloChange';

export default async function gameFinishing(gameId, gameState) {
  const aiGame = gameState.players.some(p => p.aiController);
  const ranked = !aiGame && gameState.publicGame;

  let gameType;

  if (aiGame) {
    gameType = 'aiGames';
  } else if (ranked) {
    gameType = currentSeason();
  } else {
    gameType = 'privateGames';
  }

  const players = await Promise.all(gameState.players.map(async player => {
    if (!player.playerId.match(/-/)) { return; } // Ignore guest users, this is way too ghetto

    return loadPlayer(player.playerId);
  }));

  const validPlayers = players.filter(p => p).map(([ref, p]) => {
    // Make sure we have data for this game type if necessary
    if (!p.games[gameType]) {
      return [ref, { ...p, games: { ...p.games, [gameType]: initialSeasonData() } }];
    } else {
      return [ref, p];
    }
  });

  let eloChange;
  let updatedState = gameState;

  const winner = validPlayers.find(([_, p]) => p.playerId === gameState.winner);
  const loser = validPlayers.find(([_, p]) => p.playerId !== gameState.winner);

  if (ranked && winner && loser) {
    eloChange = calculateEloChange(winner[1].games[gameType].elo, loser[1].games[gameType].elo);

    // Store the Elo score on the game object
    updatedState = { ...gameState, eloChange };
  }

  await Promise.all(validPlayers.map(async ([playerRef, playerData]) => {
    const won = playerData.playerId === gameState.winner;
    const newPlayerData = recordGameResult(playerData, gameType, won, eloChange);

    return savePlayer(playerRef, newPlayerData);
  }));

  return updatedState;
}
