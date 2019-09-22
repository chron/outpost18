import log from './log';

export default function resign(state, playerId) {
  const { gameState, players } = state;

  if (gameState === 'finished' || gameState === 'abandoned') { return state; }

  if (players.length < 2) {
    return { ...state, gameState: 'abandoned', finishedAt: new Date().toISOString() };
  } else {
    // Currently the winner is recorded by activePlayer so make sure opponent is active!
    // (for backwards compat)
    const opponent = players.find(p => p.playerId !== playerId);
    const newState = {
      ...state,
      gameState: 'finished',
      resigned: true,
      activePlayer: opponent.playerId,
      winner: opponent.playerId,
      finishedAt: new Date().toISOString(),
    };

    return log(newState, { playerId, action: { type: 'resign' } });
  }
}
