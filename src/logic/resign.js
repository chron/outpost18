import log from './log';

export default function resign(state, playerId) {
  const { gameState, players } = state;

  if (gameState === 'finished' || gameState === 'abandoned') { return state; }

  if (players.length < 2) {
    return { ...state, gameState: 'abandoned' };
  } else {
    // Currently the winner is recorded by activePlayer so make sure opponent is active!
    const opponent = players.find(p => p.playerId !== playerId);
    const newState = { ...state, gameState: 'finished', activePlayer: opponent.playerId };

    return log(newState, { playerId, action: { type: 'resign' } });
  }
}
