import React, { useEffect } from 'react';
import Loading from './Loading';

export default function JoinGame({ gameId, navigate, joinGameFunc, joinCode }) {
  useEffect(() => {
    if (gameId) {
      // TODO: show a nice error here.
      navigate('/game');
    } else {
      joinGameFunc(joinCode).then(() => navigate('/game'));
    }
  }, []);

  return <Loading />;
}
