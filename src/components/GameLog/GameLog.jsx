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
        const { actor, action: { type, cardName, cardNames, mode, amount } } = line;

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
          message = (
            <>
              attacked with{' '}
              <span className="game-log__card">{cardName}</span>
              {' '}adding {amount} attack.
            </>
          );
        } else if (type === 'destroy') {
          message = (
            <>
              spent {amount} attack to destroy{' '}
              <span className="game-log__card">{cardName}</span>
              .
            </>
          );
        } else if (type === 'discard') {
          message = (
            <>
              discarded
              {cardNames.map(n => <span key={n} className="game-log__card"> {n}</span>)}
              .
            </>
          );
        } else if (type === 'resign') {
          message = 'resigned the game.';
        } else if (type === 'mustDiscard') {
          message = 'must discard down to 3.';
        } else if (type === 'mainPhase') {
          message = `began ${determiner} main phase.`;
        } else if (type === 'timeout') {
          message = `hit ${determiner} turn time limit.`;
        } else if (type === 'draw') {
          message = `drew ${amount} card${amount === 1 ? '' : 's'}.`;
        } else if (type === 'win') {
          message = 'destroyed the Station Core!';
        } else {
          message = `-> unknown log type: ${type}!`;
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
