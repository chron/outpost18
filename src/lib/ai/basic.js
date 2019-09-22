import { MAX_HAND_SIZE } from '../../logic/constants';
import { readyShips, totalAttack, defenseUpgrades, calculateLethal, rateAction } from './utils';

const WEIGHTS = {
  player: {
    draws: 1,
    ore: 1,
    ion: 1,
    labour: 1,
    effectiveHealth: 2,
    nextTurnAttack: 2,
  },
  opponent: {
    draws: -1,
    ore: -1,
    ion: -1,
    labour: -1,
    effectiveHealth: -3,
    nextTurnAttack: -4,
  },
};
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
    const ships = readyShips(state, player);
    const lethalRequired = calculateLethal(state, opponent);

    if (attackPool >= lethalRequired) {
      const defenseCards = defenseUpgrades(state, opponent).map(c => c.name);
      const cardName = defenseCards[0] || 'Station Core';
      return { type: 'destroy', cardName };
    } else if (potentialAttack >= lethalRequired) {
      return { type: 'attack', cardName: ships[0] };
    } else if (plays > 0) {
      const possiblePlays = hand.reduce((array, cardName) => array.concat(
        { type: 'play', cardName, mode: 'ship' },
        { type: 'play', cardName, mode: 'upgrade' }
      ), [{ type: 'endTurn' }]);
      const ratedPlays = possiblePlays.map(action => [action, rateAction(state, playerId, WEIGHTS, action)]);
      const sortedPlays = ratedPlays.sort((a, b) => b[1] - a[1]);

      console.log(sortedPlays);

      const [chosenPlay, _rating] = sortedPlays[0];

      return chosenPlay;
    } else {
      return { type: 'endTurn' };
    }
  } else {
    throw new Error('No idea what to do');
  }
}
