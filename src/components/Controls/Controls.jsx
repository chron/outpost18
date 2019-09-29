import React from 'react';
import './Controls.scss';

function Controls({ children }) {
  return (
    <div className="controls">
      {children}
    </div>
  );
}

export default Controls;
