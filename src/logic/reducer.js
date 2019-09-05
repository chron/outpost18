import play from './play';
import attack from './attack';
import destroy from './destroy';
import endTurn from './endTurn';
import discard from './discard';

export default function reducer(state, action, playerId) {
  switch (action.type) {
    case 'discard':
      return discard(state, playerId, action.cardNames);
    case 'play':
      return play(state, playerId, action.cardName, action.mode);
    case 'attack':
      return attack(state, playerId, action.cardName, action.choices);
    case 'destroy':
      return destroy(state, playerId, action.cardName);
    case 'endTurn':
      return endTurn(state, playerId);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
