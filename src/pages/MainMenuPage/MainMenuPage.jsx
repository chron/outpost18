import React from 'react';
import { Link, navigate } from '@reach/router';
import { useAuth } from '../../hooks';
import './MainMenuPage.scss';

function MainMenuPage({ joinGameFunc }) {
  const { isLoggedIn, isConfirmedUser, name, logoutUser } = useAuth();

  const launchAiGame = () => {
    joinGameFunc(null, null, false, true, {}).then(() => navigate('/game'));
  };

  return (
    <div className="page page--main-menu">
      <div className="hero">
        <h1 className="game-title">Outpost 18</h1>
      </div>

      <div className="menu">
        <a tabIndex="0" onClick={launchAiGame} className="menu-item">
          Play against the AI
        </a>

        <Link
          to="/lobby"
          className={`menu-item ${isLoggedIn && isConfirmedUser ? '' : 'menu-item--disabled'}`}
        >
          Play a ranked game
        </Link>

        <Link to="/private" className="menu-item">
          Play a private game
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
            Playing as <strong>{name}</strong>
            {isConfirmedUser ? '' : '(Unconfirmed email)'}
            {' '}(<a onClick={logoutUser}>Logout</a>)
          </div>
        ) : <Link to="/login" className="current-user__panel">Log in</Link>
      }
    </div>
  );
}

export default MainMenuPage;
