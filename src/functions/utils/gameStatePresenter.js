export default function gameStatePresenter(gameState, gameId, playerId) {
  // TODO: filter data that players shouldn't see!
  return { ...gameState, gameId };
}
