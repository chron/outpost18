import Pusher from 'pusher';

const client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

export function gameStateUpdate(playerId, gameId, state) {
  // TODO: we need to auth these so you can't listen on other people's channels
  client.trigger(`${playerId}-${gameId}`, 'gameStateUpdate', state);
}
