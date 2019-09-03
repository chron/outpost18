import React, { useState, useContext } from 'react';
import { useWebsocket } from '../hooks';
import { gameAction } from '../apiClient';
import cards from '../cards';
import Alert from './Alert';

const GameContext = React.createContext();

function GameProvider({ initialGameState, gameId, playerId, children }) {
  const [gameState, setGameState] = useState(initialGameState);
  useWebsocket(playerId, gameId, newState => setGameState(newState));

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

  // TODO: we need to show the game code here!

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
