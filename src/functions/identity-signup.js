import { createPlayer as createPlayerData } from '../logic/playerManagement';
import { createPlayer } from '../lib/database';
import { initializeErrorHandling, errorWrapper, reportError } from '../lib/errorHandling';

async function handler(apiEvent, context) {
  const { event, user } = JSON.parse(apiEvent.body);

  const playerData = createPlayerData(user.sub, user.user_metadata.name, user.email);

  reportError(JSON.stringify({
    event,
    playerData,
    apiEvent,
    context,
  }));

  const newRef = await createPlayer(playerData);

  reportError(JSON.stringify({ newRef }));

  return {
    statusCode: 204,
    body: '',
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
