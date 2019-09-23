import { findCard } from '../utils';
import log from './log';

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
  const card = findCard(state, cardName);
  const defenders = inPlay
    .filter(s => s.mode === 'upgrade')
    .map(s => findCard(state, cardName))
    .filter(c => c.defender);

  if (!target) { return state; }
  if (card.shields > attackPool) { return state; }
  if (!card.defender && defenders.length > 0) { return state; }

  const destroyLog = { playerId, action: { type: 'destroy', cardName, amount: card.shields } };

  if (card.name === 'Station Core') {
    const log1 = log(state, destroyLog);
    const log2 = log(log1, { playerId, action: { type: 'win' } });

    return {
      ...log2,
      gameState: 'finished',
      winner: playerId,
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

    return log({ ...state, players: newPlayers }, destroyLog);
  }
}
