import Pusher from 'pusher';
import gameStatePresenter from './functions/utils/gameStatePresenter';

const client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

// Since Pusher's `trigger` is async let's wrap it in a Promise so we can
// use it with async/await.
function fireEvent(channel, event, message, socketId) {
  return new Promise((resolve, _reject) => {
    client.trigger(channel, event, message, socketId, resolve);
  });
}

export async function gameStateUpdate(state, gameId, playerId) {
  // TODO: we need to auth these so you can't listen on other people's channels
  const serialization = gameStatePresenter(state, gameId, playerId);
  await fireEvent(`${playerId}-${gameId}`, 'gameStateUpdate', serialization);
}
