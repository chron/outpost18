import friendlyLog from './friendlyLog';

// This function takes the current game state and a playerId and will return
// that player's view of the current state, filtering out any information they
// should not be able to see - e.g. the contents of the deck.
export default function gameStatePresenter(state, gameId, playerId) {
  const {
    deck,
    joinCode,
    discards,
    activePlayer,
    gameState,
    players,
    tick,
    turn,
    settings,
    turnStartedAt,
    publicGame,
    ruleset,
    winner,
  } = state;
  const player = players.find(p => p.playerId === playerId);
  const opponent = players.find(p => p.playerId !== playerId);

  return {
    gameId,
    ruleset,
    joinCode,
    publicGame,
    tick,
    turn,
    gameState,
    winner: winner === playerId ? 'player' : 'opponent',
    activePlayer: activePlayer === playerId ? 'player' : 'opponent',
    player: {
      ...player,
      playerId: undefined,
    },
    opponent: opponent ? {
      ...opponent,
      playerId: undefined,
      hand: undefined,
      handSize: opponent.hand.length,
    } : undefined,
    deckSize: deck.length,
    discards,
    settings,
    turnStartedAt,
    log: friendlyLog(state, playerId),
  };
}
