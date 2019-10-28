import { loadGame, loadActiveGame } from '../lib/database';
import gameStatePresenter from './utils/gameStatePresenter';
import { validPlayerId } from '../logic/gameManagement';
import { renderError } from './utils/apiResponses';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(event, context) {
  let { playerId: oldPlayerId, gameId } = event;
  const loggedIn = context.clientContext.user;
  const playerId = loggedIn ? context.clientContext.user.sub : oldPlayerId;

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!loggedIn && !validPlayerId(playerId)) { return renderError('PlayerId is not valid.'); }

  let gameState;

  if (gameId) {
    gameState = await loadGame(gameId);
  } else {
    // TODO: this case could probably be its own endpoint
    [gameId, gameState] = await loadActiveGame(playerId);

    if (!gameId) {
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
