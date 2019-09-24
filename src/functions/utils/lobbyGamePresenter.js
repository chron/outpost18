export default function lobbyGamePresenter(state, gameId) {
  const {
    joinCode,
    gameState,
    players,
    settings,
    createdAt,
    finishedAt,
    ruleset,
  } = state;

  return {
    gameId,
    ruleset,
    joinCode,
    gameState,
    playerName: players[0].name,
    opponentName: players[1] ? players[1].name : undefined,
    settings,
    createdAt,
    finishedAt,
  };
}
