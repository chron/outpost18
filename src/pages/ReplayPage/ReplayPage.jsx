import React, { useState, useEffect } from 'react';
import { loadReplay } from '../../lib/apiClient';
import Loading from '../../components/Loading';
import './ReplayPage.scss';

export default function ReplayPage({ gameId }) {
  const [replay, setReplay] = useState(null);

  useEffect(() => {
    loadReplay(gameId).then(setReplay);
  }, [gameId]);

  if (replay === null) { return <Loading />; }
  return (
    <div className="page page--replay center-children">
      <div className="panel">
        <pre>{JSON.stringify(replay, null, 2)}</pre>
      </div>
    </div>
  );
}
