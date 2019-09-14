import gameStatePresenter from './gameStatePresenter';
import { activeGames } from './lobby';
import lobbyGamePresenter from './lobbyGamePresenter';
import { fireEvent } from '../../lib/websocketServer';

export async function gameStateUpdate(state, gameId, playerId) {
  const serialization = gameStatePresenter(state, gameId, playerId);

  return fireEvent(`user-${playerId}`, 'gameStateUpdate', serialization);
}

export async function notifyOpponent(state, gameId, playerId) {
  const opponent = state.players.find(p => p.playerId !== playerId);
  if (!opponent) { return null; }

  return gameStateUpdate(state, gameId, opponent.playerId);
}

export async function refreshLobby() {
  const games = await activeGames();
  const serialization = games.map(g => lobbyGamePresenter(g));
  return fireEvent('lobby', 'refreshLobby', serialization);
}
