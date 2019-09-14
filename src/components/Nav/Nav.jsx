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

function Nav({ gameAlert, gameId }) {
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
      {gameId || true ? null : <NavLink to="/lobby">Lobby</NavLink>}
      <NavLink to="/cards">Cards</NavLink>

      <div className="nav__version">
        Version: {process.env.COMMIT_REF}
      </div>
    </div>
  );
}

export default Nav;