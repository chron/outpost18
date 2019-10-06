export function createPlayer(playerId, name, email) {
  return {
    playerId,
    name,
    email,
    games: {
      wins: 0,
      losses: 0,
    },
  };
}

export function recordGameResult(playerState, won) {
  const { games, ...rest } = playerState;

  return {
    ...rest,
    games: {
      wins: games.wins + (won ? 1 : 0),
      losses: games.losses + (won ? 0 : 1),
    },
  };
}
