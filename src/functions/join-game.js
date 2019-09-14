import { loadGameByJoinCode, saveGame } from '../lib/database';
import { notifyOpponent } from './utils/notify';
import { addPlayerToGame } from './utils/gameManagement';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/apiResponses';

export async function handler(event, _context) {
  const { playerId, playerName, joinCode } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!playerName) { return renderError('Please choose a name.'); }
  if (!joinCode) { return renderError('You must provide a game code.'); }

  const [gameId, oldGameState] = await loadGameByJoinCode(joinCode);

  if (!oldGameState) { return renderError('That game could not be found.'); }

  // TODO: validate player is not already in this game

  const gameState = addPlayerToGame(oldGameState, playerId, playerName);

  await saveGame(gameId, gameState);
  await notifyOpponent(gameState, gameId, playerId);

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
