import { discardCards } from './utils';
import beginTurn from './beginTurn';

export default function discard(state, playerId, cardNames) {
  if (state.gameState !== 'begin') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const newState = discardCards(state, playerId, cardNames);
  return beginTurn(newState, playerId);
}
