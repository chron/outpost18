import Pusher from 'pusher';
import gameStatePresenter from './functions/utils/gameStatePresenter';

const client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

export function gameStateUpdate(state, gameId, playerId) {
  console.log('Firing gameStateUpdate', gameId, playerId);

  // TODO: we need to auth these so you can't listen on other people's channels
  const serialization = gameStatePresenter(state, gameId, playerId);

  console.log(state, gameId, serialization.tick, serialization);

  client.trigger(`${playerId}-${gameId}`, 'gameStateUpdate', serialization);
}
