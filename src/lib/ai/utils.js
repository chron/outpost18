import cloneDeep from 'lodash.clonedeep';
import reducer from '../../logic/reducer';

function simulate(state, playerId, action) {
  const newState = cloneDeep(state);
  return reducer(newState, action, playerId);
}

export function readyShips(player) {
  return player.inPlay
    .filter(i => i.mode === 'ship' && i.canAttack && !i.attacking)
    .map(i => i.cardName);
}

// If we attacked with everything, how much attack could we generate total?
// (includes any attack already in the pool)
export function totalAttack(state, player) {
  const simulation = readyShips(player).reduce((prevState, cardName) => {
    return simulate(prevState, player.playerId, { type: 'attack', cardName }); // TODO: choices
  }, state);

  const simulatedPlayer = simulation.players.find(p => p.playerId === player.playerId);
  return simulatedPlayer.attackPool;
}
