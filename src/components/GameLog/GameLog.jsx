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
        const { actor, action: { type, cardName, cardNames, mode } } = line;

        const player = actor === 'player' ? 'You' : 'Your opponent';
        const determiner = actor === 'player' ? 'your' : 'their';
        let message;

        if (type === 'endTurn') {
          message = `ended ${determiner} turn.`;
        } else if (type === 'play') {
          message = (
            <>
              played
              {' '}<span className="game-log__card">{cardName}</span>
              {' '}as
              {' '}{mode === 'ship' ? 'a' : 'an'}
              {' '}{mode}
              .
            </>
          );
        } else if (type === 'attack') {
          message = `attacked with ${cardName}.`;
        } else if (type === 'destroy') {
          message = `destroyed ${cardName}.`;
        } else if (type === 'discard') {
          message = `discarded some cards: ${cardNames.join(',')}`;
        } else if (type === 'resign') {
          message = 'resigned the game.';
        } else {
          message = 'did something?';
        }

        return (
          <div key={index} className="game-log__line">
            {player} {message}
          </div>
        );
      })}
    </div>
  );
}

export default GameLog;
