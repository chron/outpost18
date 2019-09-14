import { loadGame, createGame } from '../lib/database';
import { initialGameState, addPlayerToGame, addAutomaToGame, validPlayerId } from './utils/gameManagement';
import { makeAiMovesIfNecessary } from '../lib/ai';
import { notifyOpponent, refreshLobby } from './utils/notify';
import gameStatePresenter from './utils/gameStatePresenter';
import { renderError } from './utils/apiResponses';

export async function handler(event, _context) {
  const { playerId, playerName, rematchGameId, publicGame, soloGame } = JSON.parse(event.body);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!validPlayerId(playerId)) { return renderError('PlayerId is not valid.'); }
  if (!playerName) { return renderError('Please choose a name.'); }

  const settings = publicGame ? { turnLength: 60 } : {};
  const initialState = initialGameState(publicGame, settings);

  let gameState = addPlayerToGame(initialState, playerId, playerName);

  // If the player wants a rematch, they pass the gameId in here so we can
  // figure out who their opponent was and invite them.
  // TODO: confirm step, right now they just get shoved into the new game!
  if (rematchGameId) {
    const previousGameState = await loadGame(rematchGameId);
    const opponent = previousGameState.players.find(p => p.playerId !== playerId);

    // For a rematch let's copy settings across from the original game
    gameState.settings = previousGameState.settings;

    if (opponent.aiController) {
      gameState = addAutomaToGame(gameState);
      gameState = makeAiMovesIfNecessary(gameState);
    } else {
      gameState = addPlayerToGame(gameState, opponent.playerId, opponent.name);
    }
  } else if (soloGame) {
    // Rematch takes precedence over this flag at the moment
    gameState = addAutomaToGame(gameState);
    gameState = makeAiMovesIfNecessary(gameState);
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
