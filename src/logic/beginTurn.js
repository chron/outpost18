import { updatePlayer } from './utils';
import { MAX_HAND_SIZE } from './constants';
import log from './log';

export default function beginTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);

  // They will move into either the `begin` or `main` phase depending on hand size
  if (player.hand.length > MAX_HAND_SIZE) {
    const newState = { ...state, gameState: 'begin', activePlayer: playerId };
    return log(newState, { playerId, action: { type: 'mustDiscard' } });
  } else {
    const newInPlay = player.inPlay.map(i => ({ ...i, canAttack: true }));
    const changes = { plays: 1, inPlay: newInPlay };

    let newState = updatePlayer(state, playerId, changes);
    newState = { ...newState,
      turnStartedAt: new Date().toISOString(),
      gameState: 'main',
      activePlayer: playerId,
    };

    newState = log(newState, { playerId, action: { type: 'mainPhase' } });

    return newState;
  }
}
