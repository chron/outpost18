import PubNub from 'pubnub';

const pubnub = new PubNub({
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
});

export function subscribe(playerId, gameId, callback) {
  pubnub.addListener({
    message: ({ message }) => callback(message),
  });

  pubnub.subscribe({
    channels: [`${playerId}-${gameId}`],
  });
}

export function unsubscribe(playerId, gameId) {
  pubnub.unsubscribe({
    channels: [`${playerId}-${gameId}`],
  });

  // TODO: do we need to removeListener too?
}
