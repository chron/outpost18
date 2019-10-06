import React, { useState, useEffect } from 'react';
import { navigate, Redirect } from '@reach/router';
import BackBar from '../../components/BackBar';
import { useAuth } from '../../hooks';

import './ConfirmAccountPage.scss';

function ConfirmAccountPage({ token = null }) {
  const { isLoggedIn, confirmUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) { return; }

    confirmUser(token)
      .then(() => navigate('/menu'))
      .catch(({ json: { msg } }) => setError(msg));
  }, [token]);

  if (isLoggedIn) {
    return <Redirect to="/menu" />;
  }

  return (
    <div className="page page--confirm center-children">
      <div className="panel">
        <p>You should receive a confirmation email shortly.</p>
      </div>

      {error ? <div className="error">Error confirming account: {error}</div> : null}

      <BackBar />
    </div>
  );
}

export default ConfirmAccountPage;
