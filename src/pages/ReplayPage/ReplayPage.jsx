import React, { useState, useEffect } from 'react';
import { loadReplay } from '../../lib/apiClient';
import Loading from '../../components/Loading';
import Game from '../../components/Game';
import { GameProvider } from '../../components/GameProvider';
import { initialGameState, addPlayerToGame } from '../../logic/gameManagement';
import reducer from '../../logic/reducer';
import gameStatePresenter from '../../functions/utils/gameStatePresenter';

import './ReplayPage.scss';

export default function ReplayPage({ gameId }) {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [replay, setReplay] = useState(null);
  const [replayState, setReplayState] = useState(null);
  const [logsApplied, setLogsApplied] = useState(null);
  const [playbackIndex, setPlaybackIndex] = useState(0);

  useEffect(() => {
    loadReplay(gameId).then(setReplay);
  }, [gameId]);

  useEffect(() => {
    if (!replay) { return; }

    let state;
    let logStartingPoint;

    // We can't apply logs backwards, so start from the beginning.
    if (logsApplied === null || playbackIndex < logsApplied) {
      state = initialGameState(false, replay.settings, replay.startingDeck, replay.ruleset);

      state = replay.players.reduce((prevState, { playerId, name }) => {
        return addPlayerToGame(prevState, playerId, name, {}, true); // TODO: settings?
      }, state);

      logStartingPoint = 0;
    } else {
      state = replayState;
      logStartingPoint = logsApplied;
    }

    const logEntriesToApply = replay.log.slice(logStartingPoint, playbackIndex);

    state = logEntriesToApply.reduce((prevState, { playerId, action }) => {
      const nextState = reducer(prevState, action, playerId);
      console.log(`Replayed action: ${JSON.stringify(action)}`);
      return nextState;
    }, state);

    setLogsApplied(playbackIndex);
    setReplayState(state);
  }, [replay, playbackIndex]);

  if (replayState === null) { return <Loading />; }

  const viewingPlayerId = replayState.players[playerIndex].playerId;
  const playersViewOfState = gameStatePresenter(replayState, gameId, viewingPlayerId);
  const logSize = replay.log.length;

  return (
    <div className="page page--replay">
      <div className="replay-controls">
        <button
          className="button"
          onClick={() => setPlaybackIndex(0)}
          disabled={playbackIndex === 0}
        >
          Reset
        </button>

        {' '}

        <button
          className="button"
          onClick={() => setPlaybackIndex(playbackIndex + 1)}
          disabled={playbackIndex > logSize}
        >
          Step one
        </button>

        {' '}

        <button
          className="button"
          onClick={() => setPlayerIndex(playerIndex ^ 1)}
        >
          Swap POV
        </button>

        Index: {playbackIndex}
      </div>

      <GameProvider
        readonly
        playerId={viewingPlayerId}
        gameState={playersViewOfState}
      >
        <Game />
      </GameProvider>
    </div>
  );
}
