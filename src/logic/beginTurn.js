import { updatePlayer } from './utils';

// this gets called directly by endTurn, not by an action
export default function beginTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);

  // They will move into either the `begin` or `main` phase depending on hand size
  if (player.hand.length > 3) {
    return { ...state, gameState: 'begin', activePlayer: playerId };
  } else {
    const newInPlay = player.inPlay.map(i => ({ ...i, canAttack: true }));
    const changes = { plays: 1, inPlay: newInPlay };

    let newState = updatePlayer(state, playerId, changes);
    newState = { ...newState,
      turnStartedAt: new Date().toISOString(),
      gameState: 'main',
      activePlayer: playerId,
    };

    return newState;
  }
}
