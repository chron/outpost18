import React, { useState, useEffect } from 'react';
import Normalize from 'react-normalize';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { GameProvider } from '../GameProvider';
import Game from '../Game';
import { useLocalStorage } from '../../hooks';
import { createGame, loadGame } from '../../apiClient';

import './App.scss';

function App() {
  const [gameState, setGameState] = useState({});
  const [playerId, setPlayerId] = useLocalStorage('playerId');
  const [storedGameId, setStoredGameId] = useLocalStorage('gameId');
  const { gameId } = gameState;

  if (!playerId) {
    const newPlayerId = 'test'; // TODO
    setPlayerId(newPlayerId);
  }

  if (gameId && gameId !== storedGameId) {
    setStoredGameId(gameId);
  }

  useEffect(() => {
    if (!playerId) { return; }
    if (gameId) { return; }

    if (storedGameId) { // TODO: move these into GameProvider maybe?
      loadGame(playerId, storedGameId).then(data => setGameState(data));
    } else {
      createGame(playerId, 'Player Name').then(data => setGameState(data));
    }
  }, [playerId, gameId, storedGameId]);

  return (
    <React.Fragment>
      <Normalize />

      <DndProvider backend={HTML5Backend}>
        {gameState.gameId && (
          <GameProvider gameId={gameId} playerId={playerId} initialGameState={gameState}>
            <Game />
          </GameProvider>
        )}
      </DndProvider>
    </React.Fragment>
  );
}

export default App;
