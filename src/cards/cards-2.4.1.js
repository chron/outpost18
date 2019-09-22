import cards24 from './cards-2.4';

const cards = cards24.slice();
const lotusIndex = cards.findIndex(c => c.name === 'Lotus');

cards[lotusIndex] = {
  ...cards[lotusIndex],
  abilities: [
    {
      threshold: { description: 'Discard a card' },
      effect: {
        choice: { type: 'card' },
        description: 'Play +2 cards.',
        function: (state, player, _opponent, discard) => {
          if (!discard) { return; }

          const cardIndex = player.hand.indexOf(discard);

          if (cardIndex >= 0) {
            player.hand.splice(cardIndex, 1);
            state.discards = state.discards.concat(discard);

            return { plays: 2 };
          }
        },
      },
    },
  ],
};

export default cards;
