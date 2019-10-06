export function createPlayer(playerId, name, email) {
  return {
    playerId,
    name,
    email,
    createdAt: new Date().toISOString(),
    games: {
      wins: 0,
      losses: 0,
      elo: 1000,
    },
    privateGames: {
      wins: 0,
      losses: 0,
    },
    aiGames: {
      wins: 0,
      losses: 0,
    },
  };
}

export function recordGameResult(playerState, gameType, won) {
  const { [gameType]: oldGames, ...rest } = playerState;

  return {
    ...rest,
    [gameType]: {
      wins: oldGames.wins + (won ? 1 : 0),
      losses: oldGames.losses + (won ? 0 : 1),
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}
