import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { GameProvider } from '../GameProvider';
import Game from '../Game';
import Welcome from '../Welcome';
import Loading from '../Loading';
import Error from '../Error';
import { useLocalStorage, useWebsocket } from '../../hooks';
import { createGame, joinGame, loadGame } from '../../lib/apiClient';
import generatePlayerId from '../../generatePlayerId';

import './App.scss';

function App() {
  const [gameState, setGameState] = useState({});
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useLocalStorage('playerId');
  const [playerName, setPlayerName] = useLocalStorage('playerName', 'Player');
  const [storedGameId, setStoredGameId] = useLocalStorage('gameId');
  const { gameId } = gameState;

  if (!playerId) { setPlayerId(generatePlayerId()); }

  useWebsocket(playerId, newState => {
    if (newState.gameId === gameId) {
      setGameState(newState);
    } else {
      console.error(`Expected gameId ${gameId}, got ${newState.gameId}`);
    }
  });

  useEffect(() => {
    if (!playerId) { return; }
    if (gameId) { return; }

    if (storedGameId) { // TODO: move these into GameProvider maybe?
      loadGame(playerId, storedGameId).then(data => setGameState(data));
    }
  }, [playerId, gameId, storedGameId]);

  if (storedGameId && !gameId) {
    return <Loading />;
  }

  async function joinGameFunc(joinCode) {
    const newState = joinCode
      ? await joinGame(joinCode, playerId, playerName)
      : await createGame(playerId, playerName);

    if (newState.error) {
      setError(newState.error);
    } else {
      setGameState(newState);
      setStoredGameId(newState.gameId);
    }
  }

  return (
    <>
      {gameId
        ? (
          <DndProvider backend={HTML5Backend}>
            <GameProvider
              setStoredGameId={setStoredGameId}
              playerId={playerId}
              gameState={gameState}
              setGameState={setGameState}
            >
              <Game />
            </GameProvider>
          </DndProvider>
        ) : (
          <Welcome
            playerName={playerName}
            setPlayerName={setPlayerName}
            joinGame={joinGameFunc}
          />
        )
      }

      {error && <Error>{error}</Error>}
    </>
  );
}
export default App;
