/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fs = require('fs');

const rulesets = ['2.4', '2.4.1'];
const games = JSON.parse(fs.readFileSync('database.json'));
const nonTestGames = games.filter(g => !g.players.map(p => p.name).join().match(/paul|test/i));
const finishedGames = nonTestGames.filter(g => g.gameState === 'finished');
const currentVersionGames = finishedGames.filter(g => rulesets.includes(g.ruleset));
const aiGames = currentVersionGames.filter(g => g.players.find(p => p.aiController));
const humanGames = currentVersionGames.filter(g => !g.players.find(p => p.aiController));

console.log(`Total records ingested: ${games.length}`);
console.log(`Including games with rulesets: ${JSON.stringify(rulesets)}`);

function statsForSegment(segment, segmentName) {
  console.log(`=== ${segmentName} ===`);

  console.log();
  console.log(`Total finished games for current ruleset: ${segment.length}`);

  console.log('How often does the player who goes first win?');
  console.log(segment.reduce((memo, game) => {
    const winner = game.activePlayer;
    const firstPlayer = game.players[0].playerId;

    return {
      playFirst: memo.playFirst + (winner === firstPlayer ? 1 : 0),
      playSecond: memo.playSecond + (winner === firstPlayer ? 0 : 1),
    };
  }, { playFirst: 0, playSecond: 0 }));
  console.log();

  console.log('Game count by player name');
  console.log(segment.flatMap(g => g.players).reduce((memo, player) => {
    return {
      ...memo,
      [player.name]: (memo[player.name] || 0) + 1,
    };
  }, {}));
  console.log();

  const allWinners = segment.map(g => (
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
      averagePlays: (num / segment.length).toFixed(2),
    };
  }));
  console.log();
}

statsForSegment(aiGames, 'AI Games');
statsForSegment(humanGames, 'Two-player Games');
