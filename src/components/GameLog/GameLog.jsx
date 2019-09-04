import React from 'react';
import { useGameState } from '../GameProvider';
import './GameLog.scss';

// TODO: make this collapse / expand
function GameLog() {
  const { log } = useGameState();
  if (!log) { return null; }

  return (
    <div className="game-log">
      {log.map((line, index) => {
        const { playerId, action: { type, ...rest } } = line;

        return (
          <div key={index} className="game-log__line">
            <div>{playerId}</div>
            <div>{type}</div>
            <div>{JSON.stringify(rest)}</div>
          </div>
        )
      })}
    </div>
  );
}

export default GameLog;
