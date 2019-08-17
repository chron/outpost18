function gameStateDecorator(gameState, playerId) {
  // TODO: this will filter down to only what the player should see
  return gameState;
}

// Returns a promise that resolves to the new game state
export function createGame(playerId, playerName) {
  return fetch('/.netlify/functions/create-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, playerName }),
  }).then(response => response.json());
}

export function loadGame(playerId, gameId) {
  return fetch(`/.netlify/functions/game-state?playerId=${playerId}&gameId=${gameId}`)
    .then(response => response.json())
    .then(stateJson => gameStateDecorator(stateJson));
}
