import React, { useState, useEffect } from 'react';
import { useApi, useAuth } from '../../hooks';
import BackBar from '../../components/BackBar';
import Loading from '../../components/Loading';
import './LeaderboardPage.scss';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(null);
  const { getLeaderboard } = useApi();
  const { authToken } = useAuth();

  useEffect(() => {
    getLeaderboard(authToken).then(result => setLeaderboard(result));
  }, [getLeaderboard, authToken]);

  if (leaderboard === null) { return <Loading />; }

  return (
    <div className="page page--leaderboard center-children">
      <div className="panel">
        <h1>Leaderboard</h1>

        {leaderboard.length ? (
          <div className="leaderboard">
            <div className="leaderboard__header">
              #
            </div>

            <div className="leaderboard__header">
              Name
            </div>

            <div className="leaderboard__header">
              Wins
            </div>

            <div className="leaderboard__header">
              Losses
            </div>

            <div className="leaderboard__header">
              Total
            </div>

            <div className="leaderboard__header">
              Elo
            </div>

            {leaderboard.map((player, i) => {
              return (
                <React.Fragment key={player.playerId}>
                  <div className="leaderboard__position">
                    {i + 1}
                  </div>

                  <div className="leaderboard__name">
                    {player.name}
                  </div>

                  <div className="leaderboard__wins">
                    {player.games.wins}
                  </div>

                  <div className="leaderboard__losses">
                    {player.games.losses}
                  </div>

                  <div className="leaderboard__total">
                    {player.games.wins + player.games.losses}
                  </div>

                  <div className="leaderboard__elo">
                    {player.games.elo}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <p>No player data.</p>
        )}
      </div>

      <BackBar />
    </div>
  );
}
