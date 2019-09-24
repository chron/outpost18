export default function lobbyGamePresenter(state, gameId) {
  const {
    joinCode,
    gameState,
    players: [{ name }, { name: opponentName }],
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
    playerName: name,
    opponentName,
    settings,
    createdAt,
    finishedAt,
  };
}
