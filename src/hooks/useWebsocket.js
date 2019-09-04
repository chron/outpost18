import { useEffect } from 'react';
import { subscribe, unsubscribe } from '../lib/websocketClient';

export default function useWebsocket(playerId, gameId, callback) {
  useEffect(() => {
    subscribe(playerId, gameId, callback);
    return () => unsubscribe(playerId, gameId);
  }, [playerId, gameId]); // TODO: check if callback should be a dep here?
}
