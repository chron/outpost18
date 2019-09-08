import cards from '../logic/cards';

export default function destroy(state, playerId, cardName) {
  const { gameState, activePlayer, players } = state;

  if (gameState !== 'main') { return state; }
  if (activePlayer !== playerId) { return state; }

  const playerIndex = players.findIndex(p => p.playerId === playerId);
  const player = players[playerIndex];
  const opponentIndex = players.findIndex(p => p.playerId !== playerId);
  const opponent = players[opponentIndex];

  const { attackPool, hand } = player;
  const { inPlay } = opponent;

  const targetIndex = inPlay.findIndex(s => s.cardName === cardName && ['upgrade', 'base'].includes(s.mode));
  const target = inPlay[targetIndex];
  const card = cards.find(c => c.name === cardName);
  const defenders = inPlay
    .filter(s => s.mode === 'upgrade')
    .map(s => cards.find(c => s.cardName === c.name))
    .filter(c => c.defender);

  if (!target) { return state; }
  if (card.shields > attackPool) { return state; }
  if (!card.defender && defenders.length > 0) { return state; }

  if (card.name === 'Station Core') {
    return {
      ...state,
      gameState: 'finished',
      finishedAt: new Date().toISOString(),
    };
  } else {
    const newOpponentInPlay = inPlay.slice();
    newOpponentInPlay.splice(targetIndex, 1);
    const newOpponent = { ...opponent, inPlay: newOpponentInPlay };
    const newHand = hand.concat(card.name);
    const newPlayer = { ...player, hand: newHand, attackPool: attackPool - card.shields };
    const newPlayers = [];
    newPlayers[playerIndex] = newPlayer;
    newPlayers[opponentIndex] = newOpponent;

    return { ...state, players: newPlayers };
  }
}
