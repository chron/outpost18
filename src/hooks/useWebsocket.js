import { useEffect } from 'react';
import { subscribe, unsubscribe } from '../lib/websocketClient';

export default function useWebsocket(playerId, callback) {
  useEffect(() => {
    subscribe(playerId, callback);
    return () => unsubscribe(playerId);
  }, [playerId, callback]);
}
