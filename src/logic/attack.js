import cards from './cards';
import { resourceTotalsForPlayer } from '../utils';

export default function attack(state, playerId, cardName, choices) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];
  const opponent = state.players.find(p => p.playerId !== playerId);
  const { inPlay, attackPool } = player;
  const ship = inPlay.find(s => s.cardName === cardName);

  if (!ship) { return state; }
  if (ship.mode !== 'ship') { return state; }
  if (!ship.canAttack) { return state; }
  if (ship.attacking) { return state; }

  const card = cards.find(c => c.name === cardName);

  const shipIndex = inPlay.indexOf(ship);
  const newInPlay = inPlay.slice();
  newInPlay[shipIndex] = { ...ship, attacking: true };
  const newAttackPool = attackPool + card.attack;
  let newPlayer = { ...player, inPlay: newInPlay, attackPool: newAttackPool };

  // Possible gotcha: checking here assumes these totals won't change as a result of
  // activating attack abilities (currently true)
  const resourceTotals = resourceTotalsForPlayer(player);

  // Check and apply the ship's attack abilities
  card.abilities.forEach(({ threshold, effect }) => {
    if (threshold) {
      if (threshold.todo) { return; }

      const failedThreshold = Object.entries(threshold).find(([stat, amount]) => {
        return (resourceTotals[stat] || 0) < amount;
      });

      if (failedThreshold) { return; }
    }

    if (effect.todo) { return; }

    // Gotcha: if `function` key is provided all other keys are ignored
    // TODO: right now the function can modify state - which is needed to apply some of the
    // more interesting effects - but this probably needs a rethink!
    const effectResult = effect.function ? effect.function(state, player, opponent, choices) : effect;

    if (effectResult) {
      // Some effects might mutate state directly and not return any result.
      Object.entries(effectResult).forEach(([stat, amount]) => {
        newPlayer[stat === 'attack' ? 'attackPool' : stat] += amount;
      });
    }
  });

  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = newPlayer;
  return { ...state, players: newPlayers };
}
