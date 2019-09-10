import React from 'react';
import { GameProvider } from '../components/GameProvider';
import Game from '../components/Game';
import Welcome from '../components/Welcome';

export default function GamePage({
  gameId,
  setStoredGameId,
  playerId,
  playerName,
  setPlayerName,
  gameState,
  updateGameState,
  joinGameFunc,
  rematch,
}) {
  if (gameId) {
    return (
      <GameProvider
        setStoredGameId={setStoredGameId}
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
      <Welcome
        playerName={playerName}
        setPlayerName={setPlayerName}
        joinGame={joinGameFunc}
      />
    );
  }
}
