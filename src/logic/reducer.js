import play from './play';
import attack from './attack';
import destroy from './destroy';
import endTurn from './endTurn';

export default function reducer(state, action, playerId) {
  switch(action.type) {
    case 'play':
      return play(state, playerId, action.cardName, action.mode);
    case 'attack':
      return attack(state, playerId, action.cardName);
    case 'destroy':
      return destroy(state, playerId, action.cardName);
    case 'endTurn':
      return endTurn(state, playerId);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
