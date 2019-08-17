// TODO: should these go via the reducer instead?
import play from './play';
import endTurn from './endTurn';

export default function robotTurn(state, playerId) {
  const player = state.players.find(p => p.playerId === playerId);
  const cardToPlay = player.hand[0];

  let newState = state;

  if (cardToPlay) {
    newState = play(newState, playerId, cardToPlay, Math.random() < 0.5 ? 'ship' : 'upgrade');
  }

  newState = endTurn(newState, playerId);

  return newState;
}
