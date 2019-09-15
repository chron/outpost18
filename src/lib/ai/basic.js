import { MAX_HAND_SIZE } from '../../logic/constants';
import { readyShips, totalAttack, defenseUpgrades, calculateLethal } from './utils';

// This function returns an action object that will be passed to the reducer
// the exact same way the player's input would.
// TODO: right now the AI can cheat by looking at the true state,
// might be nice to use the presenter so we don't do that accidentally.
export default function nextMove(state, playerId) {
  const { gameState, players } = state;
  const player = players.find(p => p.playerId === playerId);
  const opponent = players.find(p => p.playerId !== playerId);
  const { hand, plays, attackPool } = player;

  if (gameState === 'begin') {
    // TODO: need to evaluate the cards so we can choose which to discard sensibly.
    const cardNames = hand.slice(0, Math.max(0, hand.length - MAX_HAND_SIZE));
    return { type: 'discard', cardNames };
  } else if (gameState === 'main') {
    const potentialAttack = totalAttack(state, player);
    const ships = readyShips(player);
    const lethalRequired = calculateLethal(opponent);

    if (attackPool >= lethalRequired) {
      const defenseCards = defenseUpgrades(opponent).map(c => c.name);
      const cardName = defenseCards[0] || 'Station Core';
      return { type: 'destroy', cardName };
    } else if (potentialAttack >= lethalRequired) {
      return { type: 'attack', cardName: ships[0] };
    } else if (plays > 0) {
      return { type: 'play', cardName: hand[0], mode: 'ship' };
    } else {
      return { type: 'endTurn' };
    }
  } else {
    throw new Error('No idea what to do');
  }
}
