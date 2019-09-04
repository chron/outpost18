import Pusher from 'pusher';

const client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

// Since Pusher's `trigger` is async let's wrap it in a Promise so we can
// use it with async/await.
function fireEventAsync(channel, event, message, socketId) {
  return new Promise((resolve, _reject) => {
    client.trigger(channel, event, message, socketId, resolve);
  });
}

export async function fireEvent(gameId, playerId, eventType, message) {
  // TODO: we need to auth these so you can't listen on other people's channels
  return fireEventAsync(`${playerId}-${gameId}`, eventType, message);
}
