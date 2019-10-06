import { createPlayer as createPlayerData } from '../logic/playerManagement';
import { createPlayer } from '../lib/database';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(event, context) {
  const { event, user } = JSON.parse(event.body);

  console.log(event);

  const playerData = createPlayerData(user.sub, user.user_metadata.name, user.email);

  console.log(context);
  console.log(playerData);

  const newRef = await createPlayer(playerData);

  console.log('newref=', newRef);

  return {
    statusCode: 204,
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
