// This function takes the current game state and a playerId and will return
// that player's view of the current state, filtering out any information they
// should not be able to see - e.g. the contents of the deck.
export default function gameStatePresenter(gameState, gameId, playerId) {
  return {
    ...gameState,
    deck: undefined,
    // log: undefined,
    players: gameState.players.map(p => {
      if (p.playerId === playerId) {
        return p;
      } else {
        return { ...p, hand: undefined, handSize: p.hand.length };
      }
    }),
    deckSize: gameState.deck.length,
    gameId,
  };
}
