// Returns a promise that resolves to the new game state
export async function createGame(playerId, playerName) {
  const response = await fetch('/.netlify/functions/create-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, playerName }),
  });
  return response.json();
}

export async function loadGame(playerId, gameId) {
  const response = await fetch(`/.netlify/functions/game-state?playerId=${playerId}&gameId=${gameId}`);
  return response.json();
}

export async function gameAction(playerId, gameId, action) {
  const response = await fetch('/.netlify/functions/game-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, gameId, action }),
  });
  return response.json();
}