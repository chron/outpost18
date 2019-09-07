import Pusher from 'pusher-js';

const client = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

export function subscribe(playerId, callback) {
  const channel = client.subscribe(`user-${playerId}`);
  channel.bind('gameStateUpdate', callback);
}

export function unsubscribe(playerId) {
  client.unsubscribe(`user-${playerId}`);
}
