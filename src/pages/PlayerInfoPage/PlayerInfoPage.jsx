import React, { useState, useEffect } from 'react';
import { useApi, useAuth } from '../../hooks';
import BackBar from '../../components/BackBar';
import Loading from '../../components/Loading';
import './PlayerInfoPage.scss';

export default function PlayerInfoPage({ playerName }) {
  const [season, setSeason] = useState(null);
  const [playerData, setPlayerData] = useState(null);

  const { getPlayer } = useApi();
  const { authToken } = useAuth();

  useEffect(() => {
    getPlayer(playerName, authToken).then(result => {
      setSeason(result.season);
      setPlayerData(result.player);
    });
  }, [playerName]);

  if (playerData === null) { return <Loading />; }

  return (
    <div className="page page--player-profile center-children">
      <div className="panel">
        <h1>{playerName}</h1>
        <div className="player-tag-list">
          {playerData.tags ? playerData.tags.map(tag => (
            <div className={`player-tag player-tag--${tag}`}>{tag}</div>
          )) : null}
        </div>
        <p>
          Ranked stats for {season}:
          {' '}
          <strong>{playerData.games.wins} / {playerData.games.losses}</strong>
          {' '}
          ({playerData.games.elo} elo)
        </p>
      </div>

      <BackBar />
    </div>
  );
}
