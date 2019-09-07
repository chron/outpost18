import React from 'react';
import './Alert.scss';

function Alert({ children }) {
  return (
    <div className="full-screen-wrapper">
      <div className="panel">
        <h1>{children}</h1>
      </div>
    </div>
  );
}

export default Alert;
