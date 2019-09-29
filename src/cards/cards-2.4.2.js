import cards24 from './cards-2.4';

const cards = cards24.slice();
const lotusIndex = cards.findIndex(c => c.name === 'Lotus');

cards[lotusIndex] = {
  name: 'Lotus',
  attack: 0,
  shields: 3,
  defender: true,
  plays: 1,
  ship_ion: 1,
  ship_labour: 1,
  ship_ore: 1,
  abilities: [
    {
      effect: { draws: 2 },
    },
  ],
};

const sparkWraithIndex = cards.findIndex(c => c.name === 'Sparkwraith');

cards[sparkWraithIndex] = {
  name: 'Sparkwraith',
  attack: 1,
  shields: 2,
  ion: 1,
  ore: 2,
  hyperdrive: true,
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
          const card = cards.find(c => c.name === cardName);

          if (shipIndex >= 0) {
            opponent.inPlay.splice(shipIndex, 1);

            // TODO: DRY this into a helper function like `playCard` or something
            player.inPlay = player.inPlay.concat({
              cardName,
              mode: 'ship',
              canAttack: card.hyperdrive,
              attacking: false,
            });
          }
        },
      },
    },
  ],
};

const freighterIndex = cards.findIndex(c => c.name === 'Freighter');

cards[freighterIndex] = {
  name: 'Freighter',
  attack: 1,
  shields: 3,
  ion: 1,
  draws: 1,
  ship_ore: 1,
  abilities: [
    {
      threshold: { labour: 1, ion: 1 },
      effect: { attack: 2 },
    },
  ],
};

export default cards;
