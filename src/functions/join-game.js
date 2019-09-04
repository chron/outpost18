import { loadGameByJoinCode, saveGame } from '../lib/database';
import { notifyOpponent } from './utils/notify';
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
  await notifyOpponent(gameState, gameId, playerId);

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
