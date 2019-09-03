import Pusher from 'pusher-js';

const client = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

export function subscribe(playerId, gameId, callback) {
  const channel = client.subscribe(`${playerId}-${gameId}`);
  channel.bind('gameStateUpdate', callback);
}

export function unsubscribe(playerId, gameId) {
  client.unsubscribe(`${playerId}-${gameId}`);
}
