import React from 'react';
import './Alert.scss';

function Alert({ children }) {
  return (
    <div className="alert-wrapper">
      <div className="alert">
        {children}
      </div>
    </div>
  );
}

export default Alert;
