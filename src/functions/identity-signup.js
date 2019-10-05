import { createPlayer as createPlayerData } from '../logic/playerManagement';
import { createPlayer } from '../lib/database';
import { renderError } from './utils/apiResponses';

async function handler(_event, context) {
  const { user } = context.clientContext;
  const playerId = user.sub;

  if (!playerId) { return renderError('PlayerId must be provided.'); }

  const playerData = createPlayerData(playerId, user.name, user.email);

  await createPlayer(playerData);

  return {
    statusCode: 204,
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
