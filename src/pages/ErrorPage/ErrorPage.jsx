import React from 'react';
import BackBar from '../../components/BackBar';
import './ErrorPage.scss';

export default function ErrorPage() {
  return (
    <div className="page page--error center-children">
      <div className="panel">
        <h1>Page not found!</h1>
      </div>

      <BackBar />
    </div>
  );
}
