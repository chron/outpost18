import { useContext } from 'react';
import GameContext from './GameContext';

const resources = ['ore', 'labour', 'ion', 'draws'];

function inPlayCardsOfType(inPlayCards, modes) {
  const { cards } = useContext(GameContext);

  return inPlayCards
    .filter(s => modes.includes(s.mode))
    .map(s => cards.find(c => c.name === s.cardName) || s);
}

function sumResourceForPlayer(resource, inPlayCards) {
  const base = inPlayCardsOfType(inPlayCards, ['upgrade', 'base']);
  const ships = inPlayCardsOfType(inPlayCards, ['ship']);

  const baseTotal = base.reduce((total, b) => total + (b[resource] || 0), 0);
  return ships.reduce((total, s) => total + (s[`ship_${resource}`] || 0), baseTotal);
}

export { resources, sumResourceForPlayer };
