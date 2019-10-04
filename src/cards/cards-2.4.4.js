import cards24 from './cards-2.4';

const cards = cards24.slice();
const lotusIndex = cards.findIndex(c => c.name === 'Lotus');

cards[lotusIndex] = {
  name: 'Lotus',
  attack: 0,
  shields: 4,
  defender: true,
  ion: 1,
  ship_ion: 1,
  ship_labour: 1,
  ship_ore: 1,
  abilities: [
    {
      threshold: {
        description: '0 cards in hand',
        function: player => (player.hand ? player.hand.length : player.handSize) === 0,
      },
      effect: { attack: 1 },
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
  defender: true,
  ore: 1,
  draws: 1,
  ship_ore: 1,
  abilities: [
    {
      threshold: { labour: 1, ion: 1 },
      effect: { attack: 2 },
    },
  ],
};

const magnetIndex = cards.findIndex(c => c.name === 'Magnet');

cards[magnetIndex] = {
  name: 'Magnet',
  attack: 1,
  shields: 3,
  defender: true,
  draws: 1,
  ion: 1,
  ship_ion: 1,
  abilities: [
    {
      threshold: { labour: 1, ore: 1 },
      effect: {
        choice: { type: 'ship' },
        description: "Return an opponent's ship to their hand.",
        function: (_state, _player, opponent, cardNameToReturn) => {
          if (!cardNameToReturn) { return; }

          const shipIndex = opponent.inPlay.findIndex(i => i.cardName === cardNameToReturn);

          if (shipIndex >= 0) {
            opponent.inPlay.splice(shipIndex, 1);
            opponent.hand = opponent.hand.concat(cardNameToReturn);
          }
        },
      },
    },
  ],
};

const battlestarIndex = cards.findIndex(c => c.name === 'Battlestar');

cards[battlestarIndex] = {
  name: 'Battlestar',
  attack: 2,
  shields: 2,
  ion: 1,
  ore: 1,
  labour: 1,
  abilities: [
    {
      threshold: {
        description: 'Discard a card',
      },
      effect: {
        choice: { type: 'card' },
        description: 'Play +1 card.',
        function: (state, player, _opponent, discard) => {
          if (!discard) { return; }

          const cardIndex = player.hand.indexOf(discard);

          if (cardIndex >= 0) {
            player.hand.splice(cardIndex, 1);
            state.discards = state.discards.concat(discard);

            return { plays: 1 };
          }
        },
      },
    },
    {
      threshold: { ion: 3 },
      effect: {
        globalAttackBonus: 1,
        description: 'All your ships: +I this turn',
      },
    },
  ],
};

const centurionIndex = cards.findIndex(c => c.name === 'Centurion');

cards[centurionIndex] = {
  name: 'Centurion',
  attack: 2,
  shields: 2,
  ion: 1,
  ore: 1,
  labour: 1,
  abilities: [
    {
      threshold: { labour: 2 },
      effect: { plays: 1 },
    },
    {
      threshold: { labour: 3 },
      effect: { plays: 1 },
    },
  ],
};

export default cards;
