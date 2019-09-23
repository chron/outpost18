import { loadGameByJoinCode, saveGame } from '../lib/database';
import { notifyOpponent, refreshLobby } from './utils/notify';
import { addPlayerToGame, validPlayerId } from '../logic/gameManagement';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/apiResponses';

export async function handler(event, _context) {
  const { playerId, playerName, joinCode } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!validPlayerId(playerId)) { return renderError('PlayerId is not valid.'); }
  if (!playerName) { return renderError('Please choose a name.'); }
  if (!joinCode) { return renderError('You must provide a game code.'); }

  const [gameId, oldGameState] = await loadGameByJoinCode(joinCode);

  if (!oldGameState) { return renderError('That game could not be found.'); }

  if (oldGameState.players[0].playerId === playerId) {
    return renderError('You are already in this game.');
  }

  const gameState = addPlayerToGame(oldGameState, playerId, playerName);

  await saveGame(gameId, gameState);
  await notifyOpponent(gameState, gameId, playerId);

  if (gameState.publicGame) {
    await refreshLobby();
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}
