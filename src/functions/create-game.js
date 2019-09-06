import { createGame } from '../lib/database';
import { initialGameState, addPlayerToGame } from './utils/gameManagement';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/helpers';

export async function handler(event, _context,) {
  const { playerId, playerName } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!playerName) { return renderError('Please choose a name.'); }

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
    return renderError('Game could not be created.');
  }
}
