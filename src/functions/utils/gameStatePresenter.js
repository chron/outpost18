// This function takes the current game state and a playerId and will return
// that player's view of the current state, filtering out any information they
// should not be able to see - e.g. the contents of the deck.
export default function gameStatePresenter(gameState, gameId, playerId) {
  const player = gameState.players.find(p => p.playerId === playerId);
  const opponent = gameState.players.find(p => p.playerId !== playerId);

  // TODO: maybe make this build from scratch rather than undef everything?
  return {
    ...gameState,
    deck: undefined,
    log: undefined,
    players: undefined,
    activePlayer: gameState.activePlayer === playerId ? 'player' : opponent,
    player: {
      ...player,
      playerId: undefined,
    },
    opponent: {
      ...opponent,
      playerId: undefined,
      hand: undefined,
      handSize: opponent.hand.length,
    },
    deckSize: gameState.deck.length,
    gameId,
  };
}
