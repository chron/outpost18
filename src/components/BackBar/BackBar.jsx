import React from 'react';
import { Link } from '@reach/router';
import Controls from '../Controls';
import './BackBar.scss';

function BackBar() {
  return (
    <div className="back-bar">
      <Controls>
        <Link to="/menu" className="button">
          Back
        </Link>
      </Controls>
    </div>
  );
}

export default BackBar;
