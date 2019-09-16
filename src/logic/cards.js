// TODO: do something with these two different utils files
import { sumResourceForPlayer } from '../utils';

const cards = [
  {
    name: 'Station Core',
    shields: 5,
    draws: 1,
  },
  {
    name: 'Centurion',
    attack: 2,
    shields: 3,
    ore: 1,
    draws: 1,
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
  },
  {
    name: 'Ionblazer',
    attack: 2,
    shields: 2,
    ore: 1,
    ion: 1,
    labour: 1,
    hyperdrive: true,
    abilities: [
      {
        threshold: { ion: 2 },
        // TODO: let people opt out of this (and NOT discard if they don't destroy)
        effect: {
          choice: { type: 'ship' },
          description: 'Destroy any ship, then discard a card.',
          function: (state, player, opponent, targetShip) => {
            if (!targetShip) { return; }
            const inPlayIndex = opponent.inPlay.findIndex(i => i.cardName === targetShip);

            if (inPlayIndex) {
              opponent.inPlay.splice(inPlayIndex, 1);
              // TODO: player should choose the discarded card!
              const cardToDiscard = player.hand.splice(0, 1);

              state.discards = state.discards.concat([targetShip, ...cardToDiscard]);
            }
          },
        },
      },
    ],
  },
  {
    name: 'Battlestar',
    attack: 2,
    shields: 3,
    defender: true,
    ore: 1,
    labour: 1,
    abilities: [
      {
        threshold: { ion: 3 },
        effect: {
          globalAttackBonus: 1,
          description: 'All your ships: +I this turn',
        },
      },
    ],
  },
  {
    name: 'Epoch',
    attack: 1,
    shields: 3,
    ion: 2,
    ore: 1,
    abilities: [
      {
        threshold: { labour: 1 },
        effect: { plays: 1 },
      },
      {
        threshold: { labour: 2 },
        effect: { attack: 2 },
      },
    ],
  },
  {
    name: 'Dreadnought',
    attack: 1,
    shields: 2,
    ore: 1,
    ion: 1,
    labour: 1,
    abilities: [
      {
        threshold: {
          description: 'Discard up to 3 cards',
        },
        effect: {
          choice: { type: 'card', max: 3 },
          description: '+I for each card discarded this way.',
          function: (state, player, _opponent, discards) => {
            if (!discards) { return; }

            discards.forEach(discard => {
              const cardIndex = player.hand.indexOf(discard);

              if (cardIndex >= 0) { // TODO: validate the else case
                player.hand.splice(cardIndex, 1);
                state.discards = state.discards.concat(discard);
              }
            });

            return { attack: discards.length };
          },
        },
      },
    ],
  },
  {
    name: 'Destroyer',
    attack: 1,
    shields: 3,
    defender: true,
    ore: 1,
    labour: 1,
    abilities: [
      {
        threshold: { ore: 1, labour: 2 },
        effect: { attack: 2 },
      },
      {
        threshold: { ore: 1, ion: 2 },
        effect: { attack: 2 },
      },
    ],
  },
  {
    name: 'Helix',
    attack: 1,
    shields: 3,
    defender: true,
    ore: 1,
    ion: 1,
    abilities: [
      {
        threshold: { ore: 2 },
        effect: { attack: 2 },
      },
      {
        threshold: { ore: 3 },
        effect: {
          choice: { type: 'upgrade' },
          description: "Return an opponent's Upgrade to their hand.",
          function: (_state, _player, opponent, cardNameToReturn) => {
            if (!cardNameToReturn) { return; }
            const inPlayIndex = opponent.inPlay.findIndex(i => i.cardName === cardNameToReturn);

            if (inPlayIndex) {
              opponent.inPlay.splice(inPlayIndex, 1);
              opponent.hand = opponent.hand.concat(cardNameToReturn);
            }
          },
        },
      },
    ],
  },
  {
    name: 'Freighter',
    attack: 1,
    shields: 3,
    ore: 1,
    ion: 1,
    ship_ore: 1,
    abilities: [
      {
        threshold: { labour: 1, ion: 1 },
        effect: { attack: 2 },
      },
    ],
  },
  {
    name: 'Falcon',
    attack: 1,
    shields: 2,
    ion: 1,
    ore: 2,
    abilities: [
      {
        effect: {
          // TODO: use the symbols here
          description: '+I for each ion you generate.',
          function: (_state, player) => {
            return { attack: sumResourceForPlayer('ion', player) };
          },
        },
      },
    ],
  },
  {
    name: 'Lotus',
    attack: 0,
    shields: 3,
    ion: 1,
    draws: 1,
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
  },
  {
    name: 'Junkrig',
    attack: 1,
    shields: 3,
    defender: true,
    labour: 1,
    draws: 1,
    abilities: [
      {
        effect: {
          description: '+I for each Upgrade your opponent controls.',
          function: (_state, _player, opponent) => {
            const opponentUpgrades = opponent.inPlay.filter(c => c.mode === 'upgrade');
            return { attack: opponentUpgrades.length };
          },
        },
      },
      {
        threshold: { labour: 2 },
        effect: { plays: 1 },
      },
    ],
  },
  {
    name: 'Jackhammer',
    attack: 1,
    shields: 3,
    labour: 1,
    ion: 1,
    defender: true,
    abilities: [
      {
        threshold: { ore: 2 },
        effect: { attack: 2 },
      },
      {
        threshold: { ore: 3 },
        effect: { attack: 3 },
      },
    ],
  },
  {
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
    ],
  },
  {
    name: 'Rockbreaker',
    attack: 2,
    shields: 2,
    ore: 1,
    labour: 1,
    ion: 1,
    abilities: [
      {
        threshold: { ore: 3 },
        effect: { attack: 2 },
      },
      {
        threshold: { labour: 2 },
        effect: { plays: 1 },
      },
    ],
  },
  {
    name: 'Magnet',
    attack: 1,
    shields: 4,
    defender: true,
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
  },
  {
    name: 'Vessel',
    attack: 1,
    shields: 2,
    labour: 2,
    ion: 1,
    ship_labour: 1,
    abilities: [
      {
        threshold: { ion: 1, ore: 1 },
        effect: { plays: 1 },
      },
    ],
  },
];

export default cards;
