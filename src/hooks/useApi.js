import { useState } from 'react';
import * as apiCalls from '../lib/apiClient';

export default function useApi() {
  const [callInProgress, setCallInProgress] = useState(false);

  const decoratedCalls = Object.fromEntries(Object.entries(apiCalls).map(([funcName, func]) => {
    return [
      funcName,
      async (...args) => {
        if (callInProgress) { throw new Error('Request already in progress'); }

        setCallInProgress(true);
        const rval = await func(...args);
        setCallInProgress(false);
        return rval;
      },
    ];
  }));

  return {
    ...decoratedCalls,
    callInProgress,
  };
}
