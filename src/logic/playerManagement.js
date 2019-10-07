import calculateEloChange from '../lib/calculateEloChange';

export function createPlayer(playerId, name, email) {
  return {
    playerId,
    name,
    email,
    createdAt: new Date().toISOString(),
    tags: [],
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
    seasons: [],
  };
}

export function recordGameResult(playerState, gameType, won, opponent) {
  const { [gameType]: oldGames, ...rest } = playerState;

  let newElo;

  if (gameType === 'games') { // Ranked
    const winner = won ? playerState : opponent;
    const loser = won ? opponent : playerState;
    const eloChange = calculateEloChange(winner.games.elo, loser.games.elo);

    newElo = oldGames.elo + eloChange * (won ? 1 : -1);
  } else {
    newElo = undefined;
  }

  console.log(playerState.name, playerState.games.elo, newElo);

  return {
    ...rest,
    [gameType]: {
      wins: oldGames.wins + (won ? 1 : 0),
      losses: oldGames.losses + (won ? 0 : 1),
      elo: newElo,
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}
