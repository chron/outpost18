import React, { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Redirect, navigate } from '@reach/router';
import Controls from '../../components/Controls';
import Button from '../../components/Button';

import './SignupPage.scss';

function SignupPage() {
  const { isLoggedIn, signupUser } = useIdentityContext();
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirmation, setSignupPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = () => {
    if (signupEmail === '') {
      setError('Email must be provided.');
    } else if (signupName === '') {
      setError('Name must be provided.');
    } else if (signupPassword === '') {
      setError('Password must be provided.');
    } else if (signupPassword !== signupPasswordConfirmation) {
      setError('Password and confirmation do not match.');
    } else {
      setError(null);

      signupUser(signupEmail, signupPassword, { name: signupName })
        .then(() => navigate('/confirm'))
        .catch(e => setError(e.json.error_description));
    }
  };

  if (isLoggedIn) { return <Redirect to="/menu" />; }

  return (
    <div className="page page--login center-children">
      <div className="panel">
        <div className="game-title">New account</div>

        <div className="fieldset__wrapper">
          <label htmlFor="email" className="label fieldset__label">Email: </label>
          <input
            autoFocus
            id="email"
            className="text-input fieldset__input"
            onChange={e => setSignupEmail(e.target.value)}
            value={signupEmail}
          />
        </div>

        <div className="fieldset__wrapper">
          <label htmlFor="email" className="label fieldset__label">Username: </label>
          <input
            max="30"
            id="name"
            className="text-input fieldset__input"
            onChange={e => setSignupName(e.target.value)}
            value={signupName}
          />
        </div>

        <div className="fieldset__wrapper">
          <label htmlFor="password" className="label fieldset__label">Password: </label>
          <input
            type="password"
            id="password"
            className="text-input fieldset__input"
            onChange={e => setSignupPassword(e.target.value)}
            value={signupPassword}
          />
        </div>

        <div className="fieldset__wrapper">
          <label htmlFor="password" className="label fieldset__label">Confirm password: </label>
          <input
            type="password"
            id="passwordConfirmation"
            className="text-input fieldset__input"
            onChange={e => setSignupPasswordConfirmation(e.target.value)}
            value={signupPasswordConfirmation}
            onKeyPress={e => {
              if (e.key === 'Enter') { handleSignup(); }
            }}
          />
        </div>

        <Controls>
          <Button onClick={handleSignup}>Sign up</Button>
        </Controls>

        {error ? <div className="error">Error signing up: {error}</div> : null}
      </div>
    </div>
  );
}

export default SignupPage;
