import { findCard } from '../utils';
import log from './log';

export default function play(state, playerId, cardName, mode) {
  if (state.gameState !== 'main') { return state; }
  if (state.activePlayer !== playerId) { return state; }

  const playerIndex = state.players.findIndex(p => p.playerId === playerId);
  const player = state.players[playerIndex];

  const { hand, inPlay, plays } = player;
  const cardIndex = hand.indexOf(cardName);

  if (cardIndex < 0) { return state; }
  if (plays < 1) { return state; }

  const card = findCard(state, cardName);

  const newHand = hand.slice();
  newHand.splice(cardIndex, 1);
  const newPlays = plays - 1;
  const newInPlay = [...inPlay, { cardName, mode, canAttack: card.hyperdrive, attacking: false }];
  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, plays: newPlays, inPlay: newInPlay, hand: newHand };

  return log({ ...state, players: newPlayers }, { playerId, action: { type: 'play', cardName, mode } });
}
