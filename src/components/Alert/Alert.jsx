import React from 'react';
import './Alert.scss';

function Alert({ message }) {
  return (
    <div className="alert-wrapper">
      <div className="alert">
        {message}
      </div>
    </div>
  );
}

export default Alert;
