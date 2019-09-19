import discard from './discard';
import endTurn from './endTurn';
import { MAX_HAND_SIZE } from './constants';
import log from './log';

// This action checks if the active player has used up their time allotment.
// If they have, move on to the next player's turn.
// Note that it doesn't take playerId as an arg because it could in theory be called
// by either player.  The client only calls this for the opponent.
// TODO: is the discard choosing fair?
export default function timeout(state) {
  const { gameState, players, activePlayer, settings } = state;

  if (gameState !== 'main' && gameState !== 'begin') { return state; }
  if (!settings || !settings.turnLength) { return state; }

  const turnStartedAt = new Date(state.turnStartedAt).getTime();
  const turnShouldEndAt = turnStartedAt + settings.turnLength * 1000;

  if (new Date() < turnShouldEndAt) { return state; }

  const stateWithLog = log(state, { playerId: activePlayer, action: { type: 'timeout' } });

  // If we time out in the `begin` phase we need to discard down to MAX_HAND_SIZE.
  if (gameState === 'begin') {
    const player = players.find(p => p.playerId === activePlayer);
    const discardsNeeded = Math.max(0, player.hand.length - MAX_HAND_SIZE);
    const cardsToDiscard = player.hand.slice(0, discardsNeeded);

    const newState = discard(stateWithLog, activePlayer, cardsToDiscard);
    return endTurn(newState, activePlayer);
  } else {
    return endTurn(stateWithLog, activePlayer);
  }
}
