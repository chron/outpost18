import React, { useState, useContext } from 'react';
import { useWebsocket } from '../hooks';
import { gameAction } from '../apiClient';
import cards from '../cards';

const GameContext = React.createContext();

function GameProvider({ initialGameState, gameId, playerId, children }) {
  const [gameState, setGameState] = useState(initialGameState);

  const dispatch = (action) => {
    // eslint-disable-next-line no-console
    console.log(playerId, action);
    gameAction(playerId, gameId, action).then(newState => setGameState(newState));
  };

  useWebsocket(playerId, gameId, newState => setGameState(newState));

  const currentPlayer = gameState.players.find(p => p.playerId === playerId);
  const opponent = gameState.players.find(p => p.playerId !== playerId);

  const gameStateValue = {
    ...gameState,
    cards,
    dispatch,
    currentPlayer,
    opponent,
    myTurn: playerId === gameState.activePlayer,
  };

  return (
    <GameContext.Provider value={gameStateValue}>
      {children}
    </GameContext.Provider>
  );
}

const useGameState = () => useContext(GameContext);

export { GameProvider, useGameState };
