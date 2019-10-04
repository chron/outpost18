import fetch from 'node-fetch';

const { URL, DISCORD_WEBHOOK_URL } = process.env;

export async function reportFinishedGame(gameId, state) {
  if (!DISCORD_WEBHOOK_URL) { return; }
  if (!state.gameState === 'finished') { return; }

  const winner = state.players.find(p => p.playerId === state.winner);
  const loser = state.players.find(p => p.playerId !== state.winner);

  const content = `**${winner.name}** defeated **${loser.name}** in ${state.turn} turns.
Replay link: ${URL}/replay/${gameId}`;

  // Because `wait` defaults to `false` we don't wait for the message to
  // actually post before returning.
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}
