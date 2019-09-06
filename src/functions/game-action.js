import { loadGame, saveGame } from '../lib/database';
import { notifyOpponent } from './utils/notify';
import reducer from '../logic/reducer';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/helpers';

export async function handler(event, _context) {
  const { playerId, gameId, action } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!gameId) { return renderError('GameId must be provided.'); }
  if (!action) { return renderError('No action provided.'); }

  const oldState = await loadGame(gameId);
  const newState = await reducer(oldState, action, playerId);

  // TODO: move this logging inside the reducer probably
  const newStateWithLog = { ...newState, tick: newState.tick + 1, log: newState.log.concat({ playerId, action }) };

  // TODO: diff old and new states and skip saving / notifications if they match

  await saveGame(gameId, newStateWithLog);
  await notifyOpponent(newStateWithLog, gameId, playerId);

  return {
    statusCode: 200,
    body: JSON.stringify(gameStatePresenter(newStateWithLog, gameId, playerId)),
  };
}
