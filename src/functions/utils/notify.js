import gameStatePresenter from './gameStatePresenter';
import { fireEvent } from '../../lib/websocketServer';

export async function gameStateUpdate(state, gameId, playerId) {
  const serialization = gameStatePresenter(state, gameId, playerId);

  return fireEvent(playerId, 'gameStateUpdate', serialization);
}

export async function notifyOpponent(state, gameId, playerId) {
  const opponent = state.players.find(p => p.playerId !== playerId);

  if (!opponent) { return null; }
  return gameStateUpdate(state, gameId, opponent.playerId);
}
