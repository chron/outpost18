import { createGame } from '../lib/database';
import { initialGameState, addPlayerToGame } from './utils/gameManagement';
import gameStatePresenter from './utils/gameStatePresenter';

export async function handler(event, _context,) {
  const { playerId, playerName } = JSON.parse(event.body);

  if (!playerId || !playerName) {
    return { statusCode: 400, body: 'playerId and playerName must be provided' };
  }

  const initialState = initialGameState();
  const gameState = addPlayerToGame(initialState, playerId, playerName);

  // Persist game data to the database
  const gameId = await createGame(gameState);

  if (gameId) {
    return {
      statusCode: 200,
      body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
    };
  } else {
    return { statusCode: 400, body: 'Game could not be created.' };
  }
}
