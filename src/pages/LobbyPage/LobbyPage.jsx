import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { openGames } from '../../lib/apiClient';
import Loading from '../../components/Loading';

import './LobbyPage.scss';

// TODO: div -> panel later
export default function LobbyPage() {
  const [games, setGames] = useState(null);

  // TODO: websocket refresh

  useEffect(() => {
    openGames().then(result => setGames(result));
  }, []);

  if (games === null) { return <Loading />; }

  return (
    <div className="page page--lobby center-children">
      <div className="panel">
        <h1>Public games</h1>

        {games.length ? (
          <ul>
            {games.map(game => {
              return (
                <li key={game.joinCode}>
                  <Link to={`/join/${game.joinCode}`}>
                    {game.playerName}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No open games.</p>
        )}
      </div>
    </div>
  );
}
