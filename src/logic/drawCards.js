import shuffle from 'lodash.shuffle';
import log from './log';
import { updatePlayer } from './utils';

export default function drawCards(state, playerId, num) {
  let newState = state;
  let newDeck = newState.deck.slice();
  let cardsToDraw = newDeck.splice(0, num);

  if (cardsToDraw.length < num) {
    // If the deck is empty, shuffle discards to make a new deck
    newDeck = newDeck.concat(shuffle(state.discards));
    const shuffleResult = newDeck.slice();
    cardsToDraw = cardsToDraw.concat(newDeck.splice(0, num));
    newState = { ...newState, discards: [] };

    if (shuffleResult.length) {
      newState = log(newState, { playerId, action: { type: 'shuffle', newDeck: shuffleResult } });
    }
  }

  const player = newState.players.find(p => p.playerId === playerId);
  const newHand = player.hand.concat(cardsToDraw);
  newState = { ...newState, deck: newDeck };
  newState = updatePlayer(newState, playerId, { hand: newHand });

  return log(newState, { playerId, action: { type: 'draw', amount: num } });
}
