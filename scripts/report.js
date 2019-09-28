/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fs = require('fs');

function firstPlayerAdventage(games) {
  return games.reduce((memo, game) => {
    const winner = game.activePlayer;
    const firstPlayer = game.players[0].playerId;

    return {
      playFirst: memo.playFirst + (winner === firstPlayer ? 1 : 0),
      playSecond: memo.playSecond + (winner === firstPlayer ? 0 : 1),
    };
  }, { playFirst: 0, playSecond: 0 });
}

function gameResultsByPlayer(games) {
  return games
    .flatMap(g => g.players.map(p => ({ ...p, winner: g.activePlayer })))
    .reduce((memo, player) => {
      const data = memo[player.name] || { wins: 0, losses: 0, total: 0 };
      return {
        ...memo,
        [player.name]: {
          total: data.total + 1,
          wins: data.wins + (player.winner === player.playerId ? 1 : 0),
          losses: data.losses + (player.winner === player.playerId ? 0 : 1),
        },
      };
    }, {});
}

function winnerPlayerData(games) {
  return games.map(g => (
    { ...g.players.find(p => p.playerId === g.activePlayer), log: g.log }
  ));
}

function cardPlayFrequencies(playerData) {
  const cardsPlayedByWinners = playerData.map(p => {
    const playLogs = p.log.filter(l => l.action.type === 'play' && l.playerId === p.playerId);
    return playLogs.map(l => [l.action.cardName, l.action.mode]);
  });

  return cardsPlayedByWinners.flat().reduce((memo, combo) => {
    return {
      ...memo,
      [combo]: (memo[combo] || 0) + 1,
    };
  }, {});
}

function gameLengths(games) {
  return games.map(g => {
    return g.log.filter(l => l.action.type === 'endTurn').length;
  }).reduce((hash, v) => ({ ...hash, [v]: (hash[v] || 0) + 1 }), {});
}

function statsForSegment(segment, segmentName) {
  console.log(`=== ${segmentName} ===`);

  console.log();
  console.log(`Total finished games for current ruleset: ${segment.length}`);

  console.log('How often does the player who goes first win?');
  console.log(firstPlayerAdventage(segment));
  console.log();

  const lengths = gameLengths(segment);
  const maxLength = Math.max(...Object.keys(lengths));
  const maxFreq = Math.max(...Object.values(lengths));

  console.log('Game length histogram');
  for (let i = 0; i < maxLength; i++) {
    const bar = '#'.repeat(lengths[i] / maxFreq * 60);
    console.log(`${i > 9 ? '' : ' '}${i} ${bar} (${lengths[i] || 0})`);
  }
  console.log();

  console.log('Game results by player name');
  console.table(
    Object.entries(gameResultsByPlayer(segment))
      .map(([name, stats]) => ({
        name,
        ...stats,
        ratio: Math.round(stats.wins / stats.total * 1000) / 1000,
      }))
      .sort((a, b) => a.ratio - b.ratio)
  );
  console.log();

  const winners = winnerPlayerData(segment);
  const winnerCardPlayFrequencies = cardPlayFrequencies(winners);

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

let [,, ...rulesets] = process.argv;
rulesets = rulesets.length ? rulesets : ['2.4', '2.4.1'];

const games = JSON.parse(fs.readFileSync('database.json'));
const nonTestGames = games.filter(g => !g.players.map(p => p.name).join().match(/paul|test/i));
const finishedGames = nonTestGames.filter(g => g.gameState === 'finished');
const currentVersionGames = finishedGames.filter(g => rulesets.includes(g.ruleset));
const aiGames = currentVersionGames.filter(g => g.players.find(p => p.aiController));
const humanGames = currentVersionGames.filter(g => !g.players.find(p => p.aiController));

console.log(`Total records ingested: ${games.length}`);
console.log(`Including games with rulesets: ${JSON.stringify(rulesets)}`);

statsForSegment(aiGames, 'AI Games');
statsForSegment(humanGames, 'Two-player Games');
