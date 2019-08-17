import robotTurn from './ai';
import { updatePlayer } from './utils';

// this gets called directly by endTurn, not by an action
export default function beginTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);
  const newInPlay = player.inPlay.map(i => ({ ...i, canAttack: true }));
  const changes = { plays: 1, inPlay: newInPlay };

  // TODO: discard down to 3 somehow

  let newState = updatePlayer(state, playerId, changes);
  newState = { ...newState, gameState: 'main', activePlayer: playerId };

  if (player.aiControlled) {
    newState = robotTurn(newState, playerId);
  }

  return newState;
}
