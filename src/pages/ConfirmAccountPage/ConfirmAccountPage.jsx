import React, { useState, useEffect } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import GoTrue from 'gotrue-js';
import { navigate } from '@reach/router';

import './ConfirmAccountPage.scss';

function ConfirmAccountPage({ token = null }) {
  const { } = useIdentityContext();
  const [error, setError] = useState(null);

  console.log(token);

  useEffect(() => {
    if (!token) { return; }

    // TODO: move this low-level auth junk into a hook or something
    new GoTrue({ APIUrl: `https://${window.location.hostname}`, setCookie: true })
      .confirm(token)
      .then(() => navigate('/menu'))
      .catch(({ json: { msg } }) => setError(msg));
  }, [token]);

  return (
    <div className="page page--confirm center-children">
      <div className="panel">
        <p>You should receive a confirmation email shortly.</p>
      </div>

      {error ? <div className="error">Error confirming account: {error}</div> : null}
    </div>
  );
}

export default ConfirmAccountPage;
