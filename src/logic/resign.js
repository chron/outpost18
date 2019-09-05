export default function resign(state, playerId) {
  const { gameState } = state;

  if (gameState === 'finished') { return state; }

  const opponent = state.players.find(p => p.playerId !== playerId);

  // Currently the winner is recorded by activePlayer
  return { ...state, gameState: 'finished', activePlayer: opponent.playerId };
}
