import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { loadReplay } from '../../lib/apiClient';
import Loading from '../../components/Loading';
import Game from '../../components/Game';
import { GameProvider } from '../../components/GameProvider';
import { useReplay } from '../../hooks';
import gameStatePresenter from '../../functions/utils/gameStatePresenter';
import './ReplayPage.scss';

export default function ReplayPage({ gameId, location: { search } }) {
  const { t, p } = queryString.parse(search);
  const [playerIndex, setPlayerIndex] = useState(p || 0);
  const [replay, setReplay] = useState(null);
  const [playbackIndex, setPlaybackIndex] = useState(t || 0);

  useEffect(() => {
    loadReplay(gameId).then(setReplay);
  }, [gameId]);

  const replayState = useReplay(replay, playbackIndex);

  if (!replayState) { return <Loading />; }

  const viewingPlayerId = replayState.players[playerIndex].playerId;
  const replayView = gameStatePresenter(replayState, gameId, viewingPlayerId);

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
          disabled={playbackIndex > replay.log.length}
        >
          Next
        </button>

        {' '}

        <button
          className="button"
          onClick={() => setPlayerIndex(playerIndex ^ 1)}
        >
          Swap POV
        </button>

        {' '}

        Index: {playbackIndex}
      </div>

      <GameProvider
        readonly
        playerId={viewingPlayerId}
        gameState={replayView}
      >
        <Game />
      </GameProvider>
    </div>
  );
}
