import { loadGame, saveGame } from '../database';
import { gameStateUpdate } from '../websocketServer';
import reducer from '../logic/reducer';
import gameStatePresenter from './utils/gameStatePresenter';

export async function handler(event, _context) {
  const { playerId, gameId, action } = JSON.parse(event.body);

  if (!playerId || !gameId || !action) {
    return { statusCode: 400, body: 'playerId, gameId and action must be provided' };
  }

  const oldState = await loadGame(gameId);
  const newState = await reducer(oldState, action, playerId);
  await saveGame(gameId, newState);

  // Notify opponent of state update via websockets
  const opponent = newState.players.find(p => p.playerId !== playerId);
  if (opponent) {
    await gameStateUpdate(newState, gameId, opponent.playerId);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(newState, gameId, playerId)),
  };
}
