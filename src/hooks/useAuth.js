import GoTrue from 'gotrue-js';
import { useIdentityContext } from 'react-netlify-identity';
import { IDENTITY_URL } from '../constants';

function confirmUser(token) {
  return new GoTrue({ APIUrl: `${IDENTITY_URL}/.netlify/identity`, setCookie: true }).confirm(token);
}

export default function useAuth() {
  const { isLoggedIn, isConfirmedUser, user, loginUser, signupUser } = useIdentityContext();

  const userDetails = isLoggedIn && isConfirmedUser
    ? {
      isLoggedIn: true,
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      authToken: user.token ? user.token.access_token : null,
    } : {};

  return {
    ...userDetails,
    isConfirmedUser,
    loginUser,
    signupUser,
    confirmUser,
  };
}
