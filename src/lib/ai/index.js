import nextMove from './basic';
import reducer from '../../logic/reducer';

export function makeAiMovesIfNecessary(state) {
  let circuitBreaker = 1000;
  let newState = state;

  const activePlayer = p => p.playerId === newState.activePlayer;

  while (true) {
    // Just to make sure we don't get in an infinite loop here
    circuitBreaker -= 1;
    if (circuitBreaker <= 0) { return newState; }

    // Check if the game is over
    if (newState.gameState !== 'main' && newState.gameState !== 'begin') { return newState; }

    // Check if the active player is AI controlled
    const player = newState.players.find(activePlayer);
    if (!player.aiController) { return newState; }

    // If we got through all that, ask the AI controller to plan the next move.
    const aiAction = nextMove(newState, player.playerId);

    console.log('AI', aiAction);

    newState = reducer(newState, aiAction, player.playerId);
  }
}
