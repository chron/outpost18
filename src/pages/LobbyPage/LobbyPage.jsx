import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { openGames } from '../../lib/apiClient';
import { useWebsocket } from '../../hooks';
import Loading from '../../components/Loading';
import Controls from '../../components/Controls';
import BackBar from '../../components/BackBar';
import './LobbyPage.scss';

// TODO: div -> panel later
export default function LobbyPage() {
  const [games, setGames] = useState(null);

  useWebsocket('lobby', (event, newGamesList) => {
    if (event !== 'refreshLobby') { return; }

    setGames(newGamesList);
  });

  useEffect(() => {
    openGames().then(result => setGames(result));
  }, []);

  if (games === null) { return <Loading />; }

  return (
    <div className="page page--lobby center-children">
      <div className="panel">
        <h1>Open games</h1>

        {games.length ? (
          <ul>
            {games.map(game => {
              return (
                <li key={game.joinCode}>
                  <Link to={`/join/${game.joinCode}`}>
                    {game.playerName}
                  </Link>

                  {' '}
                  (
                  {new Date(game.createdAt).toLocaleString('en-us')}
                  )
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No open games.</p>
        )}

        <Controls>
          <Link to="/create/public" className="button">Create game</Link>
        </Controls>
      </div>

      <BackBar />
    </div>
  );
}
