import { loadGame, createGame } from '../lib/database';
import { initialGameState, addPlayerToGame } from './utils/gameManagement';
import { notifyOpponent, refreshLobby } from './utils/notify';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/apiResponses';

export async function handler(event, _context) {
  const { playerId, playerName, rematchGameId, publicGame } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!playerName) { return renderError('Please choose a name.'); }

  const initialState = initialGameState(publicGame);

  let gameState = addPlayerToGame(initialState, playerId, playerName);

  // If the player wants a rematch, they pass the gameId in here so we can
  // figure out who their opponent was and invite them.
  // TODO: confirm step
  if (rematchGameId) {
    const previousGameState = await loadGame(rematchGameId);
    const opponent = previousGameState.players.find(p => p.playerId !== playerId);

    gameState = addPlayerToGame(gameState, opponent.playerId, opponent.name);
  }

  // Persist game data to the database
  const gameId = await createGame(gameState);

  if (rematchGameId) {
    await notifyOpponent(gameState, gameId, playerId);
  }

  if (publicGame) {
    await refreshLobby();
  }

  if (gameId) {
    return {
      statusCode: 200,
      body: JSON.stringify(gameStatePresenter(gameState, gameId, playerId)),
    };
  } else {
    return renderError('Game could not be created.');
  }
}
