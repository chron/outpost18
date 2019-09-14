import { updatePlayer } from './utils';
import beginTurn from './beginTurn';

export default function discard(state, playerId, cardNames) {
  if (state.gameState !== 'begin') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const player = state.players.find(p => p.playerId === playerId);

  if (!player) { return state; }

  const { hand } = player;

  // TODO: check all cards specified are actually in hand

  const newHand = hand.filter(c => !cardNames.includes(c));
  const newDiscards = state.discards.concat(cardNames);
  const newState = {
    ...updatePlayer(state, playerId, { hand: newHand }),
    discards: newDiscards,
  };

  return beginTurn(newState, playerId);
}
