import Pusher from 'pusher-js';

const client = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

export function subscribe(playerId, opponentId, gameId, callback) {
  const channel = client.subscribe(`${playerId}-${gameId}`);
  channel.bind('gameStateUpdate', callback);
  channel.bind('debug', data => console.log('debug', data));
  client.bind_global((event, data) => console.log('bind_all', event, data));

  console.log('me', playerId, 'opponent', opponentId);
  const channel2 = client.subscribe(`${opponentId}-${gameId}`);
  channel2.bind('gameStateUpdate', data => console.log('enemy data', data));
  channel2.bind('debug', data => console.log('enemy debug', data));
}

export function unsubscribe(playerId, gameId) {
  client.unsubscribe(`${playerId}-${gameId}`);
}
