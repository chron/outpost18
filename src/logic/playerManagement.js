import { STARTING_ELO } from '../constants';

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
      elo: STARTING_ELO,
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

export function recordGameResult(playerState, gameType, won, eloChange) {
  const { [gameType]: oldGames, ...rest } = playerState;

  return {
    ...rest,
    [gameType]: {
      wins: oldGames.wins + (won ? 1 : 0),
      losses: oldGames.losses + (won ? 0 : 1),
      elo: oldGames.elo + eloChange,
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}
