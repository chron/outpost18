import React, { useState, useContext, useEffect } from 'react';
import { useWebsocket } from '../hooks';
import { gameAction } from '../lib/apiClient';
import cards from '../logic/cards';
import Alert from './Alert';

const GameContext = React.createContext();

function GameProvider({ initialGameState, setStoredGameId, playerId, children }) {
  const { gameId } = initialGameState;

  const [gameState, setGameState] = useState(initialGameState);
  // TODO: not sure if this is necessary now?
  const updateStateIfNewer = (newState) => {
    if (newState.tick > gameState.tick) { setGameState(newState); }
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
    gameAction(playerId, gameId, action).then(updateStateIfNewer);
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
        ? (
          <Alert>
            Waiting for another player.
            Join Code:
            {gameState.joinCode}
          </Alert>
        ) : children
      }
    </GameContext.Provider>
  );
}

const useGameState = () => useContext(GameContext);

export { GameProvider, useGameState };
