import cards24 from './cards-2.4';

const cards = cards24.slice();
const lotusIndex = cards.findIndex(c => c.name === 'Lotus');

cards[lotusIndex] = {
  ...cards[lotusIndex],
  shields: 4,
  defender: true,
  plays: 1,
  abilities: {
    effect: { draw: 2 },
  },
};

const sparkWraithIndex = cards.findIndex(c => c.name === 'Sparkwraith');

cards[sparkWraithIndex] = {
  ...cards[sparkWraithIndex],
  defender: true,
  plays: 1,
  abilities: [
    {
      threshold: { ion: 2 },
      effect: { attack: 2 },
    },
    {
      threshold: { labour: 3 },
      effect: {
        choice: { type: 'ship' },
        description: 'Take control of an enemy ship.',
        function: (_state, player, opponent, cardName) => {
          if (!cardName) { return; }

          const shipIndex = opponent.inPlay.findIndex(i => i.cardName === cardName);

          if (shipIndex >= 0) {
            player.inPlay = player.inPlay.concat({
              cardName,
              mode: 'ship',
              canAttack: false,
              attacking: false,
            });
          }
        },
      },
    },
  ],
};

export default cards;
