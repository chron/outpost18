import fetch from 'node-fetch';
import environment from './environment';

const { URL, DISCORD_WEBHOOK_URL, DISCORD_WEBHOOK_URL_DEV } = process.env;
const url = environment() === 'production' ? DISCORD_WEBHOOK_URL : DISCORD_WEBHOOK_URL_DEV;

export async function reportFinishedGame(gameId, state) {
  if (!url) { return; }
  if (!state.gameState === 'finished') { return; }

  const winner = state.players.find(p => p.playerId === state.winner);
  const loser = state.players.find(p => p.playerId !== state.winner);

  const content = `**${winner.name}** defeated **${loser.name}** in ${state.turn} turn${state.turn > 1 ? 's' : ''}.
Replay link: ${URL}/replay/${gameId}`;

  // Because `wait` defaults to `false` we don't wait for the message to
  // actually post before returning.
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}
