import React from 'react';
import BackBar from '../../components/BackBar';
import './AboutPage.scss';

export default function AboutPage() {
  return (
    <div className="page page--about center-children">
      <div className="panel">
        <h1>About</h1>
        <p>
          Outpost 18 is a microcardgame designed by{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/angrycyborggames/">ANGRYCYBORGGAMES</a>
          .  You can read more about it
          on <a target="_blank" rel="noopener noreferrer" href="http://playoutpost18.com">the official website</a>.
        </p>
        <p>
          This digital adaptation was created by Paul Prestidge.  The code is available{' '}
          <a target="_blank" rel="noopener noreferrer" href="http://github.com/chron/outpost18">on Github</a>
          {' '}under{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/MIT_License">the MIT license</a>
          , and suggestions / bugfixes are welcome!
        </p>
      </div>

      <BackBar />
    </div>
  );
}
