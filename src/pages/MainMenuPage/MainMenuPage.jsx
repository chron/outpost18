import React, { useEffect } from 'react';
import { Link, navigate } from '@reach/router';
import Loading from '../../components/Loading';
import { useAuth, useApi } from '../../hooks';
import './MainMenuPage.scss';

function MainMenuPage({ joinGameFunc, setGameState, initialCheck, setInitialCheck }) {
  const { isLoggedIn, isConfirmedUser, id, name, logoutUser, authToken, playerId } = useAuth();
  const { loadGame } = useApi();

  const launchAiGame = () => {
    joinGameFunc(null, null, false, true, {}).then(() => navigate('/game'));
  };

  useEffect(() => {
    if (id && !authToken) { return; }

    loadGame(playerId, undefined, authToken).then(newState => {
      setGameState(newState);
      if (newState.gameId) { navigate('/game'); }
      setInitialCheck(true);
    });
  }, [playerId, authToken]);

  if (!initialCheck) {
    return <Loading />;
  }

  return (
    <div className="page page--main-menu">
      <div className="hero">
        <h1 className="game-title">Outpost 18</h1>
      </div>

      <div className="menu">
        <Link to="/tutorial" className="menu-item">
          Play the tutorial
        </Link>

        <button type="button" onClick={launchAiGame} className="menu-item">
          Play against the AI
        </button>

        <Link
          to="/lobby"
          className={`menu-item ${isLoggedIn && isConfirmedUser ? '' : 'menu-item--disabled'}`}
        >
          Play a ranked game
        </Link>

        <Link to="/private" className="menu-item">
          Play a private game
        </Link>

        <Link to="/leaderboard" className="menu-item">
          Leaderboard
        </Link>

        <Link to="/cards" className="menu-item">
          Browse all cards
        </Link>

        <Link to="/about" className="menu-item">
          About
        </Link>
      </div>

      {isLoggedIn
        ? (
          <div className="current-user__panel">
            Playing as
            {' '}
            <Link to={`/player/${name}`}>
              <strong>{name}</strong>
            </Link>
            {isConfirmedUser ? '' : '(Unconfirmed email)'}
            {' '}(<a onClick={logoutUser}>Logout</a>)
          </div>
        ) : <Link to="/login" className="current-user__panel">Log in</Link>
      }
    </div>
  );
}

export default MainMenuPage;
