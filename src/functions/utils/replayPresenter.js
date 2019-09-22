export default function replayPresenter(state, gameId) {
  const {
    ruleset,
    players,
    log,
    winner,
    resigned,
    initialDeckOrder, // remove later
    startingDeck,
    createdAt,
    startedAt,
    finishedAt,
  } = state;

  return {
    gameId,
    ruleset,
    winner,
    resigned,
    players: players.map(p => ({
      playerId: p.playerId,
      name: p.name,
    })),
    startingDeck: initialDeckOrder || startingDeck,
    createdAt,
    startedAt,
    finishedAt,
    log,
  };
}
