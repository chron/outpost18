import { loadGame, saveGame } from '../lib/database';
import { notifyOpponent } from './utils/notify';
import reducer from '../logic/reducer';
import gameStatePresenter from './utils/gameStatePresenter';
import { validPlayerId } from '../logic/gameManagement';
import { gameFinished, gameCancelled } from './hooks';
import { renderError } from './utils/apiResponses';
import { makeAiMovesIfNecessary } from '../lib/ai';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(event, context) {
  const { playerId: oldPlayerId, gameId, action } = JSON.parse(event.body);

  const loggedIn = context.clientContext.user;
  const playerId = loggedIn ? context.clientContext.user.sub : oldPlayerId;

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!loggedIn && !validPlayerId(playerId)) { return renderError('PlayerId is not valid.'); }
  if (!gameId) { return renderError('GameId must be provided.'); }
  if (!action) { return renderError('No action provided.'); }

  const oldState = await loadGame(gameId);
  let newState = await reducer(oldState, action, playerId);

  newState = makeAiMovesIfNecessary(newState);

  // TODO: diff old and new states and skip saving / notifications if they match
  await saveGame(gameId, newState); // TODO: check success or throw exceptions in here
  await notifyOpponent(newState, gameId, playerId);

  if (newState.gameState === 'abandoned') {
    newState = await gameCancelled(gameId, newState);
  } else if (oldState.gameState !== 'finished' && newState.gameState === 'finished') {
    newState = await gameFinished(gameId, newState);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(newState, gameId, playerId)),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
