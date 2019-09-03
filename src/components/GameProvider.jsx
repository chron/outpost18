import React, { useState, useContext, useEffect } from 'react';
import { useWebsocket } from '../hooks';
import { gameAction } from '../apiClient';
import cards from '../cards';
import Alert from './Alert';

const GameContext = React.createContext();

function GameProvider({ initialGameState, setStoredGameId, playerId, children }) {
  const { gameId } = initialGameState;

  const [gameState, setGameState] = useState(initialGameState);
  useWebsocket(playerId, gameId, newState => setGameState(newState));

  // When the game ends, clear the saved gameId out.
  useEffect(() => {
    if (gameState.gameState === 'finished') {
      setStoredGameId(null);
    }
  }, [gameState.gameState, setStoredGameId]);

  const dispatch = (action) => {
    // eslint-disable-next-line no-console
    console.log(playerId, action);
    gameAction(playerId, gameId, action).then(newState => setGameState(newState));
  };

  const gameStateValue = {
    ...gameState,
    cards,
    dispatch,
    currentPlayer: gameState.players.find(p => p.playerId === playerId),
    opponent: gameState.players.find(p => p.playerId !== playerId),
    myTurn: playerId === gameState.activePlayer,
  };

  return (
    <GameContext.Provider value={gameStateValue}>
      {gameState.gameState === 'waiting'
        ? <Alert>Waiting for another player... Join Code: {gameState.joinCode}</Alert>
        : children
      }
    </GameContext.Provider>
  );
}

const useGameState = () => useContext(GameContext);

export { GameProvider, useGameState };
