import { useEffect } from 'react';
import { subscribe, unsubscribe } from '../lib/websocketClient';

export default function useWebsocket(channelName, callback) {
  useEffect(() => {
    subscribe(channelName, callback);
    return () => unsubscribe(channelName);
  }, [channelName, callback]);
}
