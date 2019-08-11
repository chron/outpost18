
function lookupCard(state, cardName) {
  return state.cards.find(c => c.name === cardName);
}

function play(state, playerName, cardName, mode) {
  const playerIndex = state.players.findIndex(p => p.name === playerName);
  const player = state.players[playerIndex];

  const { hand, inPlay, plays } = player;
  const cardIndex = hand.indexOf(cardName);

  if (cardIndex < 0) { return state; }
  if (plays < 1) { return state; }

  const card = lookupCard(state, cardName);

  const newHand = hand.slice()
  newHand.splice(cardIndex, 1);
  const newPlays = plays - 1;
  const newInPlay = [...inPlay, { cardName, mode, canAttack: card.hyperdrive, attacking: false }];
  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, plays: newPlays, inPlay: newInPlay, hand: newHand };

  return { ...state, players: newPlayers };
}

function attack(state, playerName, cardName) {
  const playerIndex = state.players.findIndex(p => p.name === playerName);
  const player = state.players[playerIndex];
  const { inPlay, attackPool } = player;
  const ship = inPlay.find(s => s.cardName === cardName);

  if (!ship) { return state; }
  if (!ship.mode === 'ship') { return state; }
  if (!ship.canAttack) { return state; }
  if (ship.attacking) { return state; }

  const card = lookupCard(state, cardName);

  const shipIndex = inPlay.indexOf(ship);
  const newInPlay = inPlay.slice();
  newInPlay[shipIndex] = { ...ship, attacking: true };
  const newAttackPool = attackPool + card.attack;

  const newPlayers = state.players.slice()
  newPlayers[playerIndex] = { ...player, inPlay: newInPlay, attackPool: newAttackPool };

  return { ...state, players: newPlayers };
}

function endTurn(state, playerName) {
  const player = state.players.find(p => p.name === playerName);
  const { inPlay } = player;

  const attackers = inPlay.filter(s => s.attacking);
  const nonAttackers = inPlay.filter(s => !s.attacking);
  const newInPlay = nonAttackers.map(i => ({ ...i, canAttack: true }));

  const changes = { attackPool: 0, plays: 1, inPlay: newInPlay };

  const newDiscards = state.discards.concat(attackers);

  return { ...updatePlayer(state, player, changes), discards: newDiscards };
}

function updatePlayer(state, player, changes) {
  const playerIndex = state.players.indexOf(player);
  const newPlayers = state.players.slice();
  newPlayers[playerIndex] = { ...player, ...changes };

  return { ...state, players: newPlayers };
}

export default function reducer(state, action) {
  console.log(action);

  switch(action.type) {
    case 'play':
      return play(state, action.playerName, action.cardName, action.mode);
    case 'attack':
      return attack(state, action.playerName, action.cardName);
    case 'endTurn':
      return endTurn(state, action.playerName);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};
