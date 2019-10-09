/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs');
const faunadb = require('faunadb');

const { query, Client } = faunadb;
const { Get, Match, Index, Replace, Ref, Collection } = query;

const games = JSON.parse(fs.readFileSync('games.json'));
const players = JSON.parse(fs.readFileSync('players.json'));

const registeredPlayerIds = players.map(p => p.playerId);

// TODO: find a nice way to re-use the existing function without ESM
const K = 30;
function calculateEloChange(winnerElo, loserElo) {
  const eloDiff = loserElo - winnerElo;
  const prob = (1.0 / (1.0 + (10 ** (eloDiff / 400))));

  return Math.round(K * (1 - prob));
}

// Reset all player wins/losses/Elo to starting values
players.forEach(p => {
  p.games = { wins: 0, losses: 0, elo: 1000 };
});

const matchingGames = games
  .filter(g => g.publicGame)
  .filter(g => g.gameState === 'finished')
  .filter(g => g.players.every(p => registeredPlayerIds.includes(p.playerId)))
  .sort((a, b) => new Date(a.finishedAt) - new Date(b.finishedAt));

matchingGames.forEach(g => {
  const winnerId = g.players.find(p => p.playerId === g.winner).playerId;
  const loserId = g.players.find(p => p.playerId !== g.winner).playerId;
  const winner = players.find(p => p.playerId === winnerId);
  const loser = players.find(p => p.playerId === loserId);

  const winnerElo = winner.games.elo;
  const loserElo = loser.games.elo;

  const eloDelta = calculateEloChange(winnerElo, loserElo);

  console.log(`${winner.name} (${winnerElo}+${eloDelta}) defeated ${loser.name} (${loserElo}-${eloDelta})`);

  winner.games.wins += 1;
  loser.games.losses += 1;
  winner.games.elo = winnerElo + eloDelta;
  loser.games.elo = loserElo - eloDelta;
});

// Persist player data back to database
const secret = process.env.FAUNADB_SECRET_KEY;
const client = new Client({ secret });

console.log('Writing updates back to database...');

Promise.all(players.map(async (data) => {
  const playerRecord = await client.query(Get(Match(Index('players_by_playerid'), data.playerId)));
  const newPlayerData = { ...playerRecord.data, games: data.games };
  await client.query(Replace(Ref(Collection('players'), playerRecord.ref.id), { data: newPlayerData }));
})).catch(e => {
  console.error(JSON.stringify(e.requestResult.requestContent.raw));
  console.error(e.requestResult.responseContent.errors);
});

console.log('Done!');
