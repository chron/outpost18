import { loadGameByJoinCode, saveGame } from '../database';
import { gameStateUpdate } from '../websocketServer';
import { addPlayerToGame } from './utils/gameManagement';
import gameStatePresenter from './utils/gameStatePresenter';

export async function handler(event, _context,) {
  const { playerId, playerName, joinCode } = JSON.parse(event.body);

  if (!playerId || !playerName || !joinCode) {
    return { statusCode: 400, body: 'joinCode, playerId, and playerName must be provided' };
  }

  const [gameId, oldGameState] = await loadGameByJoinCode(joinCode);

  if (!oldGameState) {
    return { statusCode: 400, body: 'Invalid joinCode' };
  }

  // TODO: validate player is not already in this game
  // TODO: validate game has not started and is not full

  const gameState = addPlayerToGame(oldGameState, playerId, playerName);

  await saveGame(gameId, gameState);

  // Notify opponent of state update via websockets
  const opponent = gameState.players.find(p => p.playerId !== playerId);
  if (opponent) {
    await gameStateUpdate(gameState, gameId, opponent.playerId);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
