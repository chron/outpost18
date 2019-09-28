import { updatePlayer } from './utils';
import { MAX_HAND_SIZE } from './constants';
import { sumResourceForPlayer } from '../utils';
import log from './log';

export default function beginTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);

  // They will move into either the `begin` or `main` phase depending on hand size
  if (player.hand.length > MAX_HAND_SIZE) {
    const newState = {
      ...state,
      gameState: 'begin',
      activePlayer: playerId,
      turnStartedAt: new Date().toISOString(),
    };

    return log(newState, { playerId, action: { type: 'mustDiscard' } });
  } else {
    const newInPlay = player.inPlay.map(i => ({ ...i, canAttack: true }));

    const plays = sumResourceForPlayer(state, 'plays', player);
    const changes = { plays, inPlay: newInPlay };

    // If we're already on this player's turn we shouldn't reset start time
    // Or increment the turn
    const newTurnStarting = state.activePlayer === playerId
      ? {}
      : { turnStartedAt: new Date().toISOString(), turn: state.turn + 1 };

    let newState = updatePlayer(state, playerId, changes);

    newState = {
      ...newState,
      ...newTurnStarting,
      gameState: 'main',
      activePlayer: playerId,
    };

    newState = log(newState, { playerId, action: { type: 'mainPhase' } });

    return newState;
  }
}
