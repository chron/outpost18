import { createPlayer as createPlayerData } from '../logic/playerManagement';
import { createPlayer } from '../lib/database';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(apiEvent, _context) {
  const { user } = JSON.parse(apiEvent.body);

  const playerData = createPlayerData(user.sub, user.user_metadata.name, user.email);

  await createPlayer(playerData);

  return {
    statusCode: 204,
    body: '',
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
