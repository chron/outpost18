/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fs = require('fs');

const games = JSON.parse(fs.readFileSync('database.json'));
const nonTestGames = games.filter(g => !g.players.map(p => p.name).join().match(/paul|test/i));
const nonAiGames = nonTestGames.filter(g => !g.players.find(p => p.aiController));
const currentVersionGames = nonAiGames.filter(g => g.ruleset === '2.4');
const finishedGames = currentVersionGames.filter(g => g.gameState === 'finished');

console.log(`Total records ingested: ${games.length}`);
console.log(`Total finished games for current ruleset: ${finishedGames.length}`);
console.log();

console.log('How often does the player who goes first win?');
console.log(finishedGames.reduce((memo, game) => {
  const winner = game.activePlayer;
  const firstPlayer = game.players[0].playerId;

  return {
    playFirst: memo.playFirst + (winner === firstPlayer ? 1 : 0),
    playSecond: memo.playSecond + (winner === firstPlayer ? 0 : 1),
  };
}, { playFirst: 0, playSecond: 0 }));
console.log();

console.log('Game count by player name');
console.log(finishedGames.flatMap(g => g.players).reduce((memo, player) => {
  return {
    ...memo,
    [player.name]: (memo[player.name] || 0) + 1,
  };
}, {}));
console.log();

const allWinners = finishedGames.map(g => (
  { ...g.players.find(p => p.playerId === g.activePlayer), log: g.log }
));

const cardsPlayedByWinners = allWinners.map(p => {
  const playLogs = p.log.filter(l => l.action.type === 'play' && l.playerId === p.playerId);
  return playLogs.map(l => [l.action.cardName, l.action.mode]);
});

const winnerCardPlayFrequencies = cardsPlayedByWinners.flat().reduce((memo, combo) => {
  return {
    ...memo,
    [combo]: (memo[combo] || 0) + 1,
  };
}, {});

console.log('Average card plays by game for winners only');
console.table(Object.entries(winnerCardPlayFrequencies).sort((a, b) => {
  return a[1] - b[1];
}).map(([ship, num]) => {
  const [cardName, mode] = ship.split(',');
  return {
    cardName,
    mode,
    averagePlays: (num / finishedGames.length).toFixed(2),
  };
}));
console.log();
