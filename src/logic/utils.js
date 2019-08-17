export function updatePlayer(state, playerId, changes) {
  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, ...changes };

  return { ...state, players: newPlayers };
}
