import { updatePlayer } from './utils';
import beginTurn from './beginTurn';
import log from './log';

// Gotcha: suppressLog doesn't suppress THIS log, but the one from beginTurn
export default function discard(state, playerId, cardNames, suppressLog = false) {
  if (state.gameState !== 'begin') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const player = state.players.find(p => p.playerId === playerId);

  if (!player) { return state; }

  const { hand } = player;

  // TODO: check all cards specified are actually in hand
  const newHand = hand.filter(c => !cardNames.includes(c));

  const newDiscards = state.discards.concat(cardNames);
  let newState = { ...updatePlayer(state, playerId, { hand: newHand }), discards: newDiscards };

  newState = log(newState, { playerId, action: { type: 'discard', cardNames } })

  return beginTurn(newState, playerId, suppressLog);
}
