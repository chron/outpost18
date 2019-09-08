/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fs = require('fs');

const games = JSON.parse(fs.readFileSync('database.json'));

const finishedGames = games.filter(g => g.gameState === 'finished');

console.log(finishedGames.map(g => g.players.map(p => p.name)));

console.log(`Total records: ${games.length}`);
