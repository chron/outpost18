import React from 'react';
import { Link, navigate } from '@reach/router';
import { useIdentityContext } from 'react-netlify-identity';
import './MainMenuPage.scss';

function MainMenuPage({ playerName, joinGameFunc }) {
  const { isLoggedIn } = useIdentityContext();

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

        <Link to="/lobby" className="menu-item">
          Play a public game
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
        ? <Link to="/user" className="current-user__panel">Playing as <strong>{playerName}</strong></Link>
        : <Link to="/login" className="current-user__panel">Log in</Link>
      }
    </div>
  );
}

export default MainMenuPage;
