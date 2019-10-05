import React from 'react';
import { Redirect } from '@reach/router';
import { GameProvider } from '../components/GameProvider';
import Game from '../components/Game';

export default function GamePage({
  gameId,
  playerId,
  gameState,
  updateGameState,
  rematch,
}) {
  if (gameId) {
    return (
      <GameProvider
        playerId={playerId}
        gameState={gameState}
        updateGameState={updateGameState}
        rematch={rematch}
      >
        <Game />
      </GameProvider>
    );
  } else {
    return (
      <Redirect to="/menu" />
    );
  }
}
