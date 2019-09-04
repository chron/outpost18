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
        effect: { plays: 2 },
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
        effect: { todo: 'destroy any ship, then discard' },
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
        effect: { todo: 'all ships get +1 this turn' },
      },
    ],
  },
  {
    name: 'Epoch',
    attack: 2,
    shields: 3,
    ore: 1,
    labour: 1,
    abilities: [
      {
        threshold: { labour: 1 },
        effect: { plays: 1 },
      },
      {
        threshold: { labour: 2 },
        effect: { attack: 1 },
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
        threshold: { todo: 'discard up to 3' },
        effect: { todo: '1 attack per discard' },
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
    abilities: [
      {
        threshold: { ore: 2 },
        effect: { attack: 2 },
      },
      {
        threshold: { ore: 3 },
        effect: { todo: 'return to hand' },
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
    shields: 3,
    defender: true,
    ion: 2,
    abilities: [
      {
        effect: {
          // TODO: use the symbols here
          description: '+I per ion you generate.',
          function: (_state, player) => {
            return { attack: sumResourceForPlayer('ion', player) };
          }
        },
      },
    ],
  },
  {
    name: 'Lotus',
    attack: 1,
    shields: 3,
    ion: 1,
    draws: 1,
    ship_ion: 1,
    ship_labour: 1,
    ship_ore: 1,
    abilities: [
      {
        threshold: { todo: '0 cards in hand' },
        effect: { attack: 1 },
      },
    ],
  },
  {
    name: 'Junkrig',
    attack: 1,
    shields: 3,
    defender: 3,
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
    shields: 2,
    ore: 2,
    ion: 1,
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
    ore: 2,
    ion: 2,
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
    attack: 2,
    shields: 4,
    defender: true,
    ion: 1,
    ship_ion: 1,
    abilities: [
      {
        threshold: { labour: 1, ore: 1 },
        effect: { todo: 'return opponent ship to hand' },
      },
    ],
  },
  {
    name: 'Vessel',
    attack: 2,
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
