export async function createGame(playerId, playerName, publicGame, soloGame, timed, rematchGameId) {
  const response = await fetch('/.netlify/functions/create-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, playerName, publicGame, soloGame, rematchGameId, timed }),
  });
  return response.json();
}

export async function joinGame(joinCode, playerId, playerName) {
  const response = await fetch('/.netlify/functions/join-game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ joinCode, playerId, playerName }),
  });
  return response.json();
}

export async function loadGame(playerId, gameId) {
  const response = await fetch(`/.netlify/functions/game-state?playerId=${playerId}&gameId=${gameId || ''}`);
  return response.json();
}

export async function loadReplay(gameId) {
  const response = await fetch(`/.netlify/functions/replay?gameId=${gameId}`);
  return response.json();
}

export async function openGames() {
  const response = await fetch('/.netlify/functions/open-games');
  return response.json();
}

export async function recentFinishedGames() {
  const response = await fetch('/.netlify/functions/replays');
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
