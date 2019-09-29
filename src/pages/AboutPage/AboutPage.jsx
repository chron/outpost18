import React from 'react';
import BackBar from '../../components/BackBar';
import './AboutPage.scss';

export default function AboutPage() {
  return (
    <div className="page page--about center-children">
      <div className="panel">
        <h1>About</h1>
      </div>

      <BackBar />
    </div>
  );
}
