import { loadGame, saveGame, deleteGame } from '../lib/database';
import { notifyOpponent, refreshLobby } from './utils/notify';
import reducer from '../logic/reducer';
import gameStatePresenter from './utils/gameStatePresenter';
import { validPlayerId } from '../logic/gameManagement';
import { renderError } from './utils/apiResponses';
import { makeAiMovesIfNecessary } from '../lib/ai';

export async function handler(event, _context) {
  const { playerId, gameId, action } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!validPlayerId(playerId)) { return renderError('PlayerId is not valid.'); }
  if (!gameId) { return renderError('GameId must be provided.'); }
  if (!action) { return renderError('No action provided.'); }

  const oldState = await loadGame(gameId);
  let newState = await reducer(oldState, action, playerId);

  newState = makeAiMovesIfNecessary(newState);

  // TODO: diff old and new states and skip saving / notifications if they match
  await saveGame(gameId, newState); // TODO: check success or throw exceptions in here
  await notifyOpponent(newState, gameId, playerId);

  if (newState.gameState === 'abandoned') {
    // We are now permanently deleting abandoned games!
    await deleteGame(gameId);

    if (newState.publicGame) {
      // A waiting game was abandoned so we should refresh the lobby
      // TODO: can we do this async without the function terminating?
      await refreshLobby();
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(newState, gameId, playerId)),
  };
}
