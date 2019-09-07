export default function resign(state, playerId) {
  const { gameState } = state;

  if (gameState === 'finished' || gameState === 'abandoned') { return state; }

  if (state.players.length < 2) {
    return { ...state, gameState: 'abandoned' };
  } else {
    // Currently the winner is recorded by activePlayer so make sure opponent is active!
    const opponent = state.players.find(p => p.playerId !== playerId);
    return { ...state, gameState: 'finished', activePlayer: opponent.playerId };
  }
}
