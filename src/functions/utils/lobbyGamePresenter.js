export default function lobbyGamePresenter(state) {
  const {
    gameId,
    joinCode,
    gameState,
    players: [{ name }],
    settings,
    createdAt,
    publicGame,
  } = state;

  return {
    gameId,
    joinCode,
    publicGame,
    gameState,
    playerName: name,
    settings,
    createdAt,
  };
}
