import { useContext } from 'react';
import GameContext from './GameContext';

export const resources = ['ore', 'labour', 'ion', 'draws'];

export function inPlayCardsOfType(state, inPlayCards, modes) {
  return inPlayCards
    .filter(s => modes.includes(s.mode))
    .map(s => state.cards.find(c => c.name === s.cardName) || s);
}

export function sumResourceForPlayer(state, resource, player) {
  const base = inPlayCardsOfType(state, player.inPlay, ['upgrade', 'base']);
  const ships = inPlayCardsOfType(state, player.inPlay, ['ship']);

  const baseTotal = base.reduce((total, b) => total + (b[resource] || 0), 0);
  return ships.reduce((total, s) => total + (s[`ship_${resource}`] || 0), baseTotal);
}
