import Pusher from 'pusher-js';

const client = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

export function subscribe(channelName, callback) {
  const channel = client.subscribe(channelName);
  channel.bind_global(callback);
}

export function unsubscribe(channelName) {
  client.unsubscribe(channelName);
}
