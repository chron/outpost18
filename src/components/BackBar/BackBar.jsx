import React from 'react';
import { Link } from '@reach/router';
import Controls from '../Controls';
import './BackBar.scss';

function BackBar({ children }) {
  return (
    <div className="back-bar">
      <Controls>
        {children}
        <Link to="/menu" className="button">
          Back
        </Link>
      </Controls>
    </div>
  );
}

export default BackBar;
