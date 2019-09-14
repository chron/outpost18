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

function queryAsync(path, params = {}) {
  return new Promise((resolve, reject) => {
    client.get({ path, params }, (err, _req, response) => {
      if (response.statusCode !== 200) { return reject(err); }
      return resolve(JSON.parse(response.body));
    });
  });
}

// FIXME: this doesn't seem to work
export async function isPlayerActive(playerId) {
  const r = await queryAsync(`/channels/user-${playerId}`, { info: 'subscription_count' });
  return r.subscription_count > 0;
}

export async function fireEvent(channel, eventType, message) {
  // TODO: we need to auth these so you can't listen on other people's channels
  return fireEventAsync(channel, eventType, message);
}
