import React, { useState, useEffect } from 'react';
import Normalize from 'react-normalize';
import Game from '../Game';
import cards from '../../cards';
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

    if (storedGameId) {
      loadGame(playerId, storedGameId)
        .then(data => setGameState(data));
    } else {
      createGame(playerId, 'Player Name') // TODO: names
        .then(data => setGameState(data));
    }
  }, [playerId, gameId, storedGameId]);

  return (
    <React.Fragment>
      <Normalize />

      {gameState.gameId && <Game cards={cards} gameId={gameId} initialGameState={gameState} playerId={playerId} />}
    </React.Fragment>
  );
}

export default App;
