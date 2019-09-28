import React, { useEffect } from 'react';
import { GameProvider } from '../components/GameProvider';
import Game from '../components/Game';
import Welcome from '../components/Welcome';

export default function GamePage({
  gameId,
  playerId,
  playerName,
  setPlayerName,
  gameState,
  updateGameState,
  joinGameFunc,
  rematch,
  setLastSeenTick,
}) {
  useEffect(() => {
    setLastSeenTick(gameState.tick);
  }, [gameId, gameState.tick, setLastSeenTick]);

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
      <Welcome
        playerName={playerName}
        setPlayerName={setPlayerName}
        joinGame={joinGameFunc}
      />
    );
  }
}
