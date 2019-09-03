import React, { useState, useEffect } from 'react';
import Normalize from 'react-normalize';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { GameProvider } from '../GameProvider';
import Game from '../Game';
import Welcome from '../Welcome';
import { useLocalStorage } from '../../hooks';
import { createGame, joinGame, loadGame } from '../../apiClient';
import generatePlayerId from '../../generatePlayerId';

import './App.scss';

function App() {
  const [gameState, setGameState] = useState({});
  const [playerId, setPlayerId] = useLocalStorage('playerId');
  const [playerName, setPlayerName] = useLocalStorage('playerName', 'Player');
  const [storedGameId, setStoredGameId] = useLocalStorage('gameId');
  const { gameId } = gameState;

  if (!playerId) { setPlayerId(generatePlayerId()); }

  useEffect(() => {
    if (!playerId) { return; }
    if (gameId) { return; }

    if (storedGameId) { // TODO: move these into GameProvider maybe?
      loadGame(playerId, storedGameId).then(data => setGameState(data));
    }
  }, [playerId, gameId, storedGameId]);

  // TODO: loading screen so we avoid the flash of <Welcome> on refresh

  async function createGameFunc() {
    const newState = await createGame(playerId, playerName);
    setGameState(newState);
    setStoredGameId(newState.gameId);
  }

  async function joinGameFunc(joinCode) {
    const newState = await joinGame(joinCode, playerId, playerName);
    setGameState(newState);
    setStoredGameId(newState.gameId);
  }

  return (
    <React.Fragment>
      <Normalize />

      <DndProvider backend={HTML5Backend}>
        {gameId
          ? (
            <GameProvider
              setStoredGameId={setStoredGameId}
              playerId={playerId}
              initialGameState={gameState}
            >
              <Game />
            </GameProvider>
          ) : (
            <Welcome
              playerName={playerName}
              setPlayerName={setPlayerName}
              createGame={createGameFunc}
              joinGame={joinGameFunc}
            />
          )}
      </DndProvider>
    </React.Fragment>
  );
}
export default App;
