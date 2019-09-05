import React, { useState, useContext, useEffect } from 'react';
import { useWebsocket } from '../hooks';
import { gameAction } from '../lib/apiClient';
import cards from '../logic/cards';
import Alert from './Alert';

const GameContext = React.createContext();

function GameProvider({ initialGameState, setStoredGameId, playerId, children }) {
  const { gameId } = initialGameState;

  const [gameState, setGameState] = useState(initialGameState);
  const [uiMode, setUiMode] = useState(null);

  // TODO: not sure if this is necessary now?
  const updateStateIfNewer = (newState) => {
    console.log(newState);
    if (newState.tick > gameState.tick) { setGameState(newState); }
  };

  const setChoice = ({ type, callback }) => {
    if (type === null) {
      setUiMode(null);
      return;
    }

    let validTargets = [];
    const opponent = gameState.players.find(p => p.playerId !== playerId)

    if (type === 'ship') {
      validTargets = opponent.inPlay.filter(s => s.mode === 'ship').map(s => s.cardName);
    } else if (type === 'upgrade') {
      validTargets = opponent.inPlay.filter(s => s.mode === 'upgrade').map(s => s.cardName);
      validTargets = validTargets.filter(c => c !== 'Station Core');
    }

    if (validTargets.length === 0) {
      callback();
    //} else if (validTargets.length === 1) {
    } else {
      setUiMode({ mode: 'choice', type, callback });
    }
  };

  useWebsocket(playerId, gameId, updateStateIfNewer);

  // When the game ends, clear the saved gameId out.
  // That means on page refresh you'll get the welcome screen again.
  useEffect(() => {
    if (gameState.gameState === 'finished') {
      setStoredGameId(null);
    }
  }, [gameState.gameState, setStoredGameId]);

  const dispatch = (action) => {
    try {
      gameAction(playerId, gameId, action).then(updateStateIfNewer);
    } catch (e) {
      console.log('yeet', e);
    }

    console.log('blah');
  };

  const gameStateValue = {
    ...gameState,
    cards,
    dispatch,
    uiMode,
    setUiMode, // TODO: remove this later maybe?
    setChoice,
    currentPlayer: gameState.players.find(p => p.playerId === playerId),
    opponent: gameState.players.find(p => p.playerId !== playerId),
    myTurn: playerId === gameState.activePlayer,
  };

  return (
    <GameContext.Provider value={gameStateValue}>
      {gameState.gameState === 'waiting'
        ? (
          <Alert>
            Waiting for another player.
            {' '}
            Join Code:
            {' '}
            {gameState.joinCode}
          </Alert>
        ) : children
      }
    </GameContext.Provider>
  );
}

const useGameState = () => useContext(GameContext);

export { GameProvider, useGameState };
