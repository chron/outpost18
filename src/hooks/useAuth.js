import { useState, useEffect } from 'react';
import GoTrue from 'gotrue-js';
import { useIdentityContext } from 'react-netlify-identity';
import { IDENTITY_URL } from '../constants';

function confirmUser(token) {
  return new GoTrue({ APIUrl: `${IDENTITY_URL}/.netlify/identity`, setCookie: true }).confirm(token);
}

export default function useAuth() {
  const { isLoggedIn, isConfirmedUser, user, loginUser, logoutUser, signupUser } = useIdentityContext();

  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    if (!user) { return; }

    user.jwt().then(newAuthToken => setAuthToken(newAuthToken));
  }, [user]);

  const userDetails = isLoggedIn && isConfirmedUser
    ? {
      isLoggedIn: true,
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      authToken,
    } : {};

  return {
    ...userDetails,
    isConfirmedUser,
    loginUser,
    logoutUser,
    signupUser,
    confirmUser,
  };
}
