import React, { useState, useEffect } from 'react';
import { Router, Redirect, navigate } from '@reach/router';
import WelcomePage from '../../pages/WelcomePage';
import MainMenuPage from '../../pages/MainMenuPage';
import GamePage from '../../pages/GamePage';
import AllCardsPage from '../../pages/AllCardsPage';
import LobbyPage from '../../pages/LobbyPage';
import AboutPage from '../../pages/AboutPage';
import TutorialPage from '../../pages/TutorialPage';
import CreateGamePage from '../../pages/CreateGamePage';
import LoginPage from '../../pages/LoginPage';
import SignupPage from '../../pages/SignupPage';
import ConfirmAccountPage from '../../pages/ConfirmAccountPage';
import JoinPrivateGamePage from '../../pages/JoinPrivateGamePage';
import ErrorPage from '../../pages/ErrorPage';
import ReplayPage from '../../pages/ReplayPage';
import ReplayListPage from '../../pages/ReplayListPage';
import Error from '../Error';
import JoinGame from '../JoinGame';
import { useApi, useAuth, useLocalStorage, useWebsocket, useWindowSize } from '../../hooks';
import generatePlayerId from '../../generatePlayerId';
import './App.scss';
import LeaderboardPage from '../../pages/LeaderboardPage/LeaderboardPage';
import PlayerInfoPage from '../../pages/PlayerInfoPage/PlayerInfoPage';

function App() {
  const [initialCheck, setInitialCheck] = useState(false);
  const [gameState, setGameState] = useState({});
  const [error, setError] = useState(null);
  const [oldPlayerId, setOldPlayerId] = useLocalStorage('playerId');
  const [playerName, setPlayerName] = useLocalStorage('playerName', null);
  const { name, id, authToken } = useAuth();
  const { createGame, joinGame } = useApi();

  if (!oldPlayerId) { setOldPlayerId(generatePlayerId()); }

  const playerId = id || oldPlayerId;

  // Set a CSS var to use as the window height since mobile browsers don't always
  // factor in the same amount of UI height.
  const { height } = useWindowSize();
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
  }, [height]);

  useWebsocket(`user-${playerId}`, (event, newState) => {
    if (event !== 'gameStateUpdate') { return; }

    setGameState(newState);
  });

  // Reach router doesn't work with location.hash so we'll hand-roll it!
  const tokenMatch = window.location.hash.match(/confirmation_token=(\w+)/);
  if (tokenMatch) {
    return <Redirect to={`confirm/${tokenMatch[1]}`} />;
  }

  const { gameId } = gameState;

  async function joinGameFunc(joinCode, rematchGameId, publicGame, addAi, settings) {
    const newState = joinCode
      ? await joinGame(joinCode, playerId, name || playerName, authToken)
      : await createGame(playerId, name || playerName, publicGame, addAi, settings, rematchGameId, authToken);

    if (newState.error) {
      setError(newState.error);
    } else {
      setGameState(newState);
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

  // Checking for 'Player' because that used to be the default, later we can remove this.
  if (!playerName || playerName === '' || playerName === 'Player') {
    return (
      <WelcomePage playerName={playerName} setPlayerName={setPlayerName} />
    );
  }

  return (
    <Router>
      <WelcomePage path="user" playerName={playerName} setPlayerName={setPlayerName} />
      <MainMenuPage
        path="menu"
        playerName={playerName}
        joinGameFunc={joinGameFunc}
        setGameState={setGameState} // FIXME: feels weird to pass these things in here
        playerId={playerId}
        initialCheck={initialCheck}
        setInitialCheck={setInitialCheck}
      />
      <GamePage
        path="game"
        gameId={gameId}
        playerId={playerId}
        gameState={gameState}
        updateGameState={updateGameState}
        joinGameFunc={joinGameFunc}
        rematch={rematch}
      />
      <AboutPage path="about" />
      <LoginPage path="login" />
      <ConfirmAccountPage path="confirm/:token" />
      <ConfirmAccountPage path="confirm" />
      <SignupPage path="signup" />
      <TutorialPage path="tutorial" />
      <CreateGamePage path="create/:gameType" joinGameFunc={joinGameFunc} />
      <JoinPrivateGamePage path="private" joinGameFunc={joinGameFunc} />
      <PlayerInfoPage path="player/:playerName" />
      <ReplayPage path="replay/:gameId" />
      <ReplayListPage path="replays" />
      <LeaderboardPage path="leaderboard" />
      <AllCardsPage path="cards" />
      <LobbyPage path="lobby" />
      <JoinGame gameId={gameId} joinGameFunc={joinGameFunc} path="join/:joinCode" />
      <ErrorPage default />
      <Redirect from="/" to={gameId ? 'game' : 'menu'} />

      {error && <Error>{error}</Error>}
    </Router>
  );
}
export default App;
