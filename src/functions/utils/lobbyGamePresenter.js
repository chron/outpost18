export default function lobbyGamePresenter(state) {
  const {
    gameId,
    joinCode,
    gameState,
    players: [{ name }],
    settings,
    createdAt,
    publicGame,
    ruleset,
  } = state;

  return {
    gameId,
    ruleset,
    joinCode,
    publicGame,
    gameState,
    playerName: name,
    settings,
    createdAt,
  };
}
