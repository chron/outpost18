import { STARTING_ELO } from '../constants';

export function createPlayer(playerId, name, email) {
  return {
    playerId,
    name,
    email,
    createdAt: new Date().toISOString(),
    tags: [],
    games: {},
  };
}

export function recordGameResult(playerState, gameType, won, eloChange) {
  const { games: { [gameType]: oldGames, ...otherGames }, ...rest } = playerState;

  return {
    ...rest,
    games: {
      ...otherGames,
      [gameType]: {
        wins: oldGames.wins + (won ? 1 : 0),
        losses: oldGames.losses + (won ? 0 : 1),
        elo: oldGames.elo + (won ? 1 : -1) * eloChange,
      },
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}
