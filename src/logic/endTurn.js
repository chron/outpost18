
import drawCards from './drawCards';
import { sumResourceForPlayer } from '../utils';
import beginTurn from './beginTurn';
import { updatePlayer } from './utils';
import log from './log';

export default function endTurn(state, playerId) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  let newState = state;
  const player = state.players.find(p => p.playerId === playerId);

  // Move ships that attacked to the discard pile
  const attackers = player.inPlay.filter(s => s.attacking);
  const nonAttackers = player.inPlay.filter(s => !s.attacking);
  const newDiscards = state.discards.concat(attackers.map(c => c.cardName));
  newState = { ...newState, discards: newDiscards };
  newState = updatePlayer(newState, playerId, {
    attackPool: 0,
    plays: 0,
    globalAttackBonus: undefined,
    inPlay: nonAttackers,
  });

  newState = log(newState, { playerId, action: { type: 'endTurn' } });

  // Draw cards equal to your draws stat
  const draws = sumResourceForPlayer(newState, 'draws', player);
  newState = drawCards(newState, playerId, draws);

  // Begin turn for next player
  const opponent = state.players.find(p => p.playerId !== playerId);
  newState = beginTurn(newState, opponent.playerId);

  return newState;
}
