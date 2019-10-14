import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { useApi, useAuth } from '../../hooks';
import Loading from '../../components/Loading';
import './ReplayListPage.scss';

export default function ReplayPage() {
  const { authToken } = useAuth();
  const { recentFinishedGames } = useApi();
  const [games, setGames] = useState(null);

  useEffect(() => {
    recentFinishedGames(authToken).then(result => setGames(result));
  }, []);

  if (games === null) { return <Loading />; }

  return (
    <div className="page page--lobby center-children">
      <div className="panel">
        <h1>Recent finished games</h1>

        {games.length ? (
          <ul>
            {games.map(({ gameId, playerName, opponentName, finishedAt }) => {
              return (
                <li key={gameId}>
                  <Link to={`/replay/${gameId}`}>
                    {playerName} vs {opponentName}
                  </Link>

                  {' '}
                  (
                  {new Date(finishedAt).toLocaleString('en-us')}
                  )
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No recent games.</p>
        )}
      </div>
    </div>
  );
}
