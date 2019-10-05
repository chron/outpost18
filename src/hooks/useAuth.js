import GoTrue from 'gotrue-js';
import { useIdentityContext } from 'react-netlify-identity';
import { IDENTITY_URL } from '../constants';

function confirmUser(token) {
  return new GoTrue({ APIUrl: `${IDENTITY_URL}/.netlify/identity`, setCookie: true }).confirm(token);
}

export default function useAuth() {
  const { isLoggedIn, user, loginUser, signupUser } = useIdentityContext();

  const userDetails = isLoggedIn
    ? {
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      authToken: user.token.access_token,
    } : {};

  return {
    isLoggedIn,
    ...userDetails,
    loginUser,
    signupUser,
    confirmUser,
  };
}
