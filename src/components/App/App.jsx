import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Router, Redirect } from '@reach/router';
import GamePage from '../../pages/GamePage';
import AllCardsPage from '../../pages/AllCardsPage';
import LobbyPage from '../../pages/LobbyPage';
import ErrorPage from '../../pages/ErrorPage';
import Nav from '../Nav';
import Loading from '../Loading';
import Error from '../Error';
import JoinGame from '../JoinGame';
import { useLocalStorage, useWebsocket } from '../../hooks';
import { createGame, joinGame, loadGame } from '../../lib/apiClient';
import generatePlayerId from '../../generatePlayerId';
import './App.scss';

function App() {
  const [gameState, setGameState] = useState({});
  const [lastSeenTick, setLastSeenTick] = useState(null);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useLocalStorage('playerId');
  const [playerName, setPlayerName] = useLocalStorage('playerName', 'Player');
  const [storedGameId, setStoredGameId] = useLocalStorage('gameId');
  const { gameId } = gameState;

  if (!playerId) { setPlayerId(generatePlayerId()); }

  // TODO: do we need some protection against the gameId changing here?
  useWebsocket(`user-${playerId}`, (event, newState) => {
    if (event !== 'gameStateUpdate') { return; }

    setGameState(newState);
    if (newState.gameId !== storedGameId) {
      setStoredGameId(newState.gameId);
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

  async function joinGameFunc(joinCode, rematchGameId, publicGame) {
    const newState = joinCode
      ? await joinGame(joinCode, playerId, playerName)
      : await createGame(playerId, playerName, publicGame, rematchGameId);

    if (newState.error) {
      setError(newState.error);
    } else {
      setGameState(newState);
      setLastSeenTick(null);
      setStoredGameId(newState.gameId);
    }
  }

  const updateGameState = newState => {
    if (newState.gameState === 'abandoned') {
      setGameState({});
    } else {
      setGameState(newState);
    }
  };

  // TODO: confirmation
  function rematch() {
    if (gameState.gameState !== 'finished') { return; }

    joinGameFunc(null, gameId);
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Nav
          gameId={gameId}
          gameAlert={lastSeenTick < gameState.tick}
        />

        <Router>
          <GamePage
            path="game"
            gameId={gameId}
            setStoredGameId={setStoredGameId}
            playerId={playerId}
            playerName={playerName}
            setPlayerName={setPlayerName}
            gameState={gameState}
            updateGameState={updateGameState}
            joinGameFunc={joinGameFunc}
            rematch={rematch}
            setLastSeenTick={setLastSeenTick}
          />
          <AllCardsPage path="cards" />
          <LobbyPage path="lobby" />
          <JoinGame gameId={gameId} joinGameFunc={joinGameFunc} path="join/:joinCode" />
          <ErrorPage default />
          <Redirect from="/" to="game" />
        </Router>
      </DndProvider>

      {error && <Error>{error}</Error>}
    </>
  );
}
export default App;
