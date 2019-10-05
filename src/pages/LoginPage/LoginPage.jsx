import React, { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { navigate, Link } from '@reach/router';
import { useLocalStorage } from '../../hooks';
import Controls from '../../components/Controls';
import Button from '../../components/Button';

import './LoginPage.scss';

function LoginPage() {
  const { loginUser } = useIdentityContext();
  const [loginEmail, setLoginEmail] = useLocalStorage('loginEmail', '');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);

    loginUser(loginEmail, loginPassword, true)
      .then(r => console.log('!', r))
      .then(() => navigate('/menu'))
      .catch(e => setError(e.json.error_description));
  };

  return (
    <div className="page page--login center-children">
      <div className="panel">
        <div className="game-title">Login</div>

        <Controls>
          <Link to="/signup" className="button">Create Account</Link>
        </Controls>

        <div className="fieldset__wrapper">
          <label htmlFor="email" className="label fieldset__label">Email: </label>
          <input
            autoFocus
            id="email"
            className="text-input fieldset__input"
            onChange={e => setLoginEmail(e.target.value)}
            value={loginEmail}
          />
        </div>

        <div className="fieldset__wrapper">
          <label htmlFor="password" className="label fieldset__label">Password: </label>
          <input
            type="password"
            id="password"
            className="text-input fieldset__input"
            onChange={e => setLoginPassword(e.target.value)}
            value={loginPassword}
            onKeyPress={e => {
              if (e.key === 'Enter') { handleLogin(); }
            }}
          />
        </div>

        <Controls>
          <Button onClick={handleLogin}>Login</Button>
        </Controls>

        {error ? <div className="error">Error logging in: {error}</div> : null}
      </div>
    </div>
  );
}

export default LoginPage;
