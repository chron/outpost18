export default function gameStatePresenter(gameState, gameId, playerId) {
  return {
    ...gameState,
    deck: undefined,
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
