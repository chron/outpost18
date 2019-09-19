import log from './log';

export function updatePlayer(state, playerId, changes) {
  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, ...changes };

  return { ...state, players: newPlayers };
}

export function discardCards(state, playerId, cardNames) {
  const player = state.players.find(p => p.playerId === playerId);

  if (!player) { return state; }

  const { hand } = player;

  // TODO: check all cards specified are actually in hand
  const newHand = hand.filter(c => !cardNames.includes(c));

  const newDiscards = state.discards.concat(cardNames);
  const newState = { ...updatePlayer(state, playerId, { hand: newHand }), discards: newDiscards };

  return log(newState, { playerId, action: { type: 'discard', cardNames } });
}
