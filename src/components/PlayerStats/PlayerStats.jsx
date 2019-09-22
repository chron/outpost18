import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { resources, sumResourceForPlayer } from '../../utils';
import ResourceIcon from '../ResourceIcon';
import './PlayerStats.scss';
import { useGameState } from '../GameProvider';
import ProgressBar from '../ProgressBar';

const CLIENT_TIMEOUT_GRACE_PERIOD = 1000;

// TODO: draws icon
function PlayerStats({ player, friendly = false }) {
  const gameState = useGameState();
  const { activePlayer, gameInProgress, turnStartedAt, settings, dispatch } = gameState;
  const turnLength = settings && settings.turnLength;
  const { hand, handSize, plays, attackPool } = player;
  const [timeLeft, setTimeLeft] = useState();
  const [sentTimeout, setSentTimeout] = useState(false);
  const belongsToActivePlayer = activePlayer === (friendly ? 'player' : 'opponent');

  // We'll only send one timeout notification per turn, so reset it when activePlayer changes.
  useEffect(() => {
    setSentTimeout(false);
  }, [activePlayer]);

  useEffect(() => {
    if (turnLength && belongsToActivePlayer && gameInProgress) {
      const timer = setInterval(() => {
        const turnEndsAt = new Date(turnStartedAt).getTime() + turnLength * 1000 + CLIENT_TIMEOUT_GRACE_PERIOD;
        const turnTimeRemaining = Math.max(0, (turnEndsAt - new Date().getTime()) / 1000);

        if (!sentTimeout && turnTimeRemaining <= 0 && !friendly && gameInProgress) {
          setSentTimeout(true);
          dispatch({ type: 'timeout' });
        }

        setTimeLeft(turnTimeRemaining);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameInProgress, setTimeLeft, turnLength, turnStartedAt, sentTimeout, belongsToActivePlayer, dispatch, friendly]);

  return (
    <div className={`player-stats player-stats--${friendly ? '' : 'enemy'}`}>
      <div className="player-stats__resources">
        <div className="player-stats__resource-row">
          <div className="player-stats__resource">
            <div className="player-stats__resource-amount">{handSize === undefined ? hand.length : handSize}</div>
            <div className="player-stats__resource-icon">cards</div>
          </div>

          <div className="player-stats__resource">
            <div className="player-stats__resource-amount">{plays}</div>
            <div className="player-stats__resource-icon">plays</div>
          </div>

          <div className="player-stats__resource">
            <div
              className={classNames('player-stats__resource-amount', {
                'player-stats__resource-amount--emphasis': attackPool > 0,
              })}
            >
              {attackPool}
            </div>
            <div className="player-stats__resource-icon">attack</div>
          </div>
        </div>

        <div className="player-stats__resource-row">
          {Object.keys(resources).map((resource) => {
            const amount = sumResourceForPlayer(gameState, resource, player);

            return (
              <div key={resource} className="player-stats__resource">
                <div className="player-stats__resource-amount">{amount}</div>
                <div className="player-stats__resource-icon">
                  {resource === 'draws'
                    ? 'Draws'
                    : <ResourceIcon resource={resource} num={1} />
                  }
                </div>
              </div>
            );
          })}
        </div>

        {belongsToActivePlayer && turnLength && timeLeft ? (
          <ProgressBar current={timeLeft} max={turnLength} />
        ) : null}
      </div>
    </div>
  );
}

export default PlayerStats;
