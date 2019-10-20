import { isThresholdMet, findCard } from '../utils';
import drawCards from './drawCards';
import log from './log';

export default function attack(state, playerId, cardName, choices = []) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const opponentIndex = state.players.findIndex(p => p.playerId !== playerId);

  const player = state.players[playerIndex];
  const opponent = state.players[opponentIndex];
  const ship = player.inPlay.find(s => s.cardName === cardName);

  if (!ship) { return state; }
  if (ship.mode !== 'ship') { return state; }
  if (!ship.canAttack) { return state; }
  if (ship.attacking) { return state; }

  const card = findCard(state, cardName);
  const newPlayer = { ...player };
  const oldAttackPool = newPlayer.attackPool;
  let draws = 0;

  // Check and apply the ship's attack abilities
  card.abilities.forEach(({ threshold, effect }) => {
    if (threshold && !isThresholdMet(state, threshold, player)) { return; }

    // Gotcha: if `function` key is provided all other keys are ignored
    // TODO: right now the function can modify state - which is needed to apply some of the
    // more interesting effects - but this probably needs a rethink!

    const effectResult = effect.function
      ? effect.function(state, player, opponent, ...choices)
      : effect;

    // Some effects might mutate state directly and not return any result.
    if (effectResult) {
      Object.entries(effectResult).forEach(([stat, amount]) => {
        if (stat === 'description') { return; }

        if (stat === 'draws') { draws += amount; return; }
        const playerStat = stat === 'attack' ? 'attackPool' : stat;

        newPlayer[playerStat] = newPlayer[playerStat] || 0;
        newPlayer[playerStat] += amount;
      });
    }
  });

  // Important to update this after effects that might change the global attack bonus!
  newPlayer.attackPool += card.attack + (newPlayer.globalAttackBonus || 0);

  const attackDelta = newPlayer.attackPool - oldAttackPool;

  const shipIndex = player.inPlay.indexOf(ship);
  const newInPlay = player.inPlay.slice();
  newInPlay[shipIndex] = { ...ship, attacking: true, attackAdded: attackDelta };
  newPlayer.inPlay = newInPlay;

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = newPlayer;
  newPlayers[opponentIndex] = opponent;

  let newState = log(
    { ...state, players: newPlayers },
    { playerId, action: { type: 'attack', cardName, amount: attackDelta, choices } }
  );

  if (draws > 0) {
    newState = drawCards(newState, playerId, draws);
  }

  return newState;
}
