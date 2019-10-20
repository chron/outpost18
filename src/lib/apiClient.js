const API_BASE_URL = '/.netlify/functions';

async function get(action, params = {}, token = null) {
  const queryString = Object.entries(params)
    .filter(([_, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}=${v}`).join('&');

  const response = await fetch(`${API_BASE_URL}/${action}?${queryString}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  return response.json();
}

async function post(action, payload, token) {
  const response = await fetch(`${API_BASE_URL}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: payload,
  });

  return response.json();
}

export async function createGame(playerId, playerName, publicGame, soloGame, settings, rematchGameId, token) {
  return post(
    'create-game',
    JSON.stringify({ playerId, playerName, publicGame, soloGame, rematchGameId, settings }),
    token
  );
}

export async function joinGame(joinCode, playerId, playerName, token) {
  return post(
    'join-game',
    JSON.stringify({ joinCode, playerId, playerName }),
    token
  );
}

export async function gameAction(playerId, gameId, action, token) {
  return post(
    'game-action',
    JSON.stringify({ playerId, gameId, action }),
    token
  );
}

export async function loadGame(playerId, gameId = '', token) {
  return get('game-state', { playerId, gameId }, token);
}

export async function loadReplay(gameId, token) {
  return get('replay', { gameId }, token);
}

export async function openGames(token) {
  return get('open-games', {}, token);
}

export async function recentFinishedGames(playerId, token) {
  return get('replays', { playerId }, token);
}

export async function getLeaderboard(season, token) {
  return get('leaderboard', { season }, token);
}

export async function getPlayer(playerName, token) {
  return get('player', { playerName }, token);
}
