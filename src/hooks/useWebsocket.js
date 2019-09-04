import { useEffect } from 'react';
import { subscribe, unsubscribe } from '../websocketClient';

export default function useWebsocket(playerId, opponentId, gameId, callback) {
  useEffect(() => {
    subscribe(playerId, opponentId, gameId, callback);
    return () => unsubscribe(playerId, gameId);
  }, [playerId, opponentId, gameId]); // TODO: check if callback should be a dep here?
}
