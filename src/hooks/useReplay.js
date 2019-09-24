import { useState, useEffect } from 'react';
import { initialGameState, addPlayerToGame } from '../logic/gameManagement';
import reducer from '../logic/reducer';

export default function useReplay(replayData, playbackIndex) {
  const [replayState, setReplayState] = useState(null);
  const [logsApplied, setLogsApplied] = useState(null);

  useEffect(() => {
    if (!replayData) { return; }

    const { seed, settings, ruleset, log, players } = replayData;

    let state;
    let logStartingPoint;

    // We can't apply logs backwards, so start from the beginning.
    if (logsApplied === null || playbackIndex < logsApplied) {
      state = initialGameState(false, settings, ruleset, seed);

      state = players.reduce((prevState, { playerId, name }) => {
        return addPlayerToGame(prevState, playerId, name, {}, true); // TODO: settings?
      }, state);

      logStartingPoint = 0;
    } else {
      state = replayState;
      logStartingPoint = logsApplied;
    }

    const logEntriesToApply = log.slice(logStartingPoint, playbackIndex);

    state = logEntriesToApply.reduce((prevState, { playerId, action }) => {
      const nextState = reducer(prevState, action, playerId);
      return nextState;
    }, state);

    setLogsApplied(playbackIndex);
    setReplayState(state);
  }, [replayData, playbackIndex, logsApplied, replayState]);

  return replayState;
}
