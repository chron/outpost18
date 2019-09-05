import React from 'react';
import './Error.scss';

export default function Error({ children }) {
  return (
    <div className="error">
      Error:
      {children}
    </div>
  );
}
