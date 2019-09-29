import React from 'react';
import { Link, navigate } from '@reach/router';
import './MainMenuPage.scss';

function MainMenuPage({ playerName, joinGameFunc }) {
  const launchAiGame = () => {
    joinGameFunc(null, null, false, true, false).then(() => navigate('/game'));
  };

  return (
    <div className="page page--main-menu">
      <div className="hero">
        Outpost 18
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

      <Link to="/user" className="current-user__panel">
        Playing as <strong>{playerName}</strong>
      </Link>
    </div>
  );
}

export default MainMenuPage;
