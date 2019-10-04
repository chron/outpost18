import { loadGame, createGame } from '../lib/database';
import { initialGameState, addPlayerToGame, addAutomaToGame, validPlayerId } from '../logic/gameManagement';
import { makeAiMovesIfNecessary } from '../lib/ai';
import { notifyOpponent, refreshLobby } from './utils/notify';
import gameStatePresenter from './utils/gameStatePresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';
import { renderError } from './utils/apiResponses';

async function handler(event, _context) {
  const {
    playerId,
    playerName,
    rematchGameId,
    publicGame,
    soloGame,
    settings, // TODO: validate this using Joi or something similar
  } = JSON.parse(event.body);

  console.log(process.env);

  if (!playerId) { return renderError('PlayerId must be provided.'); }
  if (!validPlayerId(playerId)) { return renderError('PlayerId is not valid.'); }
  if (!playerName) { return renderError('Please choose a name.'); }

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

  let gameId;
  // Persist game data to the database
  try {
    gameId = await createGame(gameState);
  } catch (e) {
    return renderError('Error saving game to database! The backend is probably down.');
  }

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

initializeErrorHandling();
exports.handler = errorWrapper(handler);
