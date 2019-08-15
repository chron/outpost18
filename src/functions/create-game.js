import cards from '../cards';
import shuffle from 'lodash.shuffle';

exports.handler = function(event, context, callback) {
  const baseStats = { cardName: 'Station Core', mode: 'base' };
  const deck = shuffle(cards.map(c => c.name).filter(c => c !== 'Station Core'));

  const gameState = {
    gameState: 'main',
    activePlayer: 'me',
    cards,
    deck,
    discards: [],
    players: ['me', 'opponent'].map(name => {
      return {
        name,
        plays: name === 'me' ? 1 : 0,
        attackPool: 0,
        hand: deck.splice(0, name === 'me' ? 2 : 3),
        inPlay: [{ ...baseStats }],
      }
    }),
  };

  // Store in db

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify(gameState),
  });
}
