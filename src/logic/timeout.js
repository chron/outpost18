import beginTurn from './beginTurn';

// This action checks if the active player has used up their time allotment.
// If they have, move on to the next player's turn.
// TODO: if they timeout in discard phase should we discard for them?
export default function timeout(state) {
  const { gameState, players, activePlayer, settings } = state;

  if (gameState === 'finished' || gameState === 'abandoned') { return state; }
  if (!settings || !settings.turnLength) { return state; }

  const turnStartedAt = new Date(state.turnStartedAt).getTime();
  const turnShouldEndAt = turnStartedAt + settings.turnLength * 1000;

  if (new Date() < turnShouldEndAt) { return state; }

  const nonActivePlayer = players.find(p => p.playerId !== activePlayer);

  return beginTurn(state, nonActivePlayer.playerId);
}
