import PubNub from 'pubnub';
import gameStatePresenter from './functions/utils/gameStatePresenter';

const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  uuid,
});

export function gameStateUpdate(state, gameId, playerId) {
  // TODO: we need to auth these so you can't listen on other people's channels
  const serialization = gameStatePresenter(state, gameId, playerId);

  pubnub.publish({
    channel: `${playerId}-${gameId}`,
    message: serialization,
  }, (status, response) => {
    console.log(status, response);
  });
}
