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

  // TODO: move this logging inside the reducer probably
  const newStateWithLog = { ...newState, tick: newState.tick + 1, log: newState.log.concat({ playerId, action }) };

  // TODO: diff old and new states and skip saving / notifications if they match

  await saveGame(gameId, newStateWithLog);

  // Notify opponent of state update via websockets
  const opponent = newStateWithLog.players.find(p => p.playerId !== playerId);
  if (opponent) {
    await gameStateUpdate(newStateWithLog, gameId, opponent.playerId);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(newStateWithLog, gameId, playerId)),
  };
}
