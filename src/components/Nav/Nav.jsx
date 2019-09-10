import React from 'react';
import { Link } from '@reach/router';
import './Nav.scss';

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        className: `nav__item${isCurrent ? ' nav__item--active' : ''}`
      }
    }}
  />
);

function Nav() {
  return (
    <div className="nav">
      <div className="nav__logo">
        Outpost 18
      </div>

      <NavLink to="/game">Game</NavLink>
      <NavLink to="/cards">Cards</NavLink>
    </div>
  );
}

export default Nav;
