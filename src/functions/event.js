import { createEvent } from '../lib/database';
import { renderError } from './utils/apiResponses';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';
import { VALID_EVENTS } from '../constants';

async function handler(event, context) {
  const {
    playerId: oldPlayerId,
    type,
  } = JSON.parse(event.body);

  const loggedIn = context.clientContext.user;
  const playerId = loggedIn ? context.clientContext.user.sub : oldPlayerId;

  if (!playerId || playerId === '') { return renderError('PlayerId must be provided.'); }
  if (!type) { return renderError('Type must be provided.'); }
  if (!VALID_EVENTS.has(type)) { return renderError('Type is invalid.'); }

  const timestamp = new Date();

  await createEvent(type, playerId, timestamp);

  return {
    statusCode: 204,
    body: '',
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
