import React from 'react';
import { Link } from '@reach/router';
import './Nav.scss';

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        className: `nav__item${isCurrent ? ' nav__item--active' : ''}`,
      };
    }}
  />
);

function Nav({ gameAlert, gameState }) {
  return (
    <div className="nav">
      <div className="nav__logo">
        Outpost 18
      </div>

      <NavLink to="/game">
        Game
        {gameAlert ? (
          <div title="New activity!" className="nav__badge">
            !
          </div>
        ) : null}
      </NavLink>
      {gameState && gameState !== 'finished' ? null : <NavLink to="/lobby">Lobby</NavLink>}
      {/* <NavLink to="/replays">Replays</NavLink> */}
      <NavLink to="/cards">Cards</NavLink>

      <div className="nav__version">
        Version: {process.env.COMMIT_REF.slice(0, 7)}
      </div>
    </div>
  );
}

export default Nav;
