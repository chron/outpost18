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

function gameCountByDay(games) {
  return games.filter(g => g.finishedAt).map(g => {
    const d = new Date(g.finishedAt);
    const month = d.getMonth() + 1;
    return `${d.getFullYear()}-${month <= 9 ? '0' : ''}${month}-${d.getDate() <= 9 ? '0' : ''}${d.getDate()}`;
  }).filter(g => g);
}

function gameCountByHour(games) {
  return games.filter(g => g.finishedAt).map(g => {
    const hour = new Date(g.finishedAt).getHours();
    return `${hour <= 9 ? '0' : ''}${hour}`;
  });
}

function gameLengths(games) {
  return games.map(g => {
    return g.log.filter(l => l.action.type === 'endTurn').length;
  });
}

function realTimeLengths(games) {
  return games.map(g => {
    const len = new Date(g.finishedAt) - new Date(g.startedAt);
    return Math.round(len / 1000 / 60);
  });
}

function frequencies(array) {
  return array.reduce((hash, v) => ({ ...hash, [v]: (hash[v] || 0) + 1 }), {});
}

function histogram(data, cutoff = null) {
  const maxData = Math.max(...Object.keys(data));
  const maxFreq = Math.max(...Object.values(data));
  const limit = cutoff ? Math.min(cutoff, maxData) : maxData;

  for (let i = 0; i <= limit; i++) {
    const bar = '#'.repeat(data[i] / maxFreq * 60);
    const label = data[i] ? ` (${data[i]})` : '';
    console.log(`${i > 9 ? '' : ' '}${i} | ${bar}${label}`);
  }
}

function statsForSegment(segment, segmentName) {
  console.log(`=== ${segmentName} ===`);

  console.log();
  console.log(`Total finished games for current ruleset: ${segment.length}`);

  console.log('How often does the player who goes first win?');
  console.log(firstPlayerAdventage(segment));
  console.log();

  console.log('Games finished per day');
  console.table(Object.entries(frequencies(gameCountByDay(segment))).sort());
  console.log();

  console.log('Games finished by hour-of-day');
  console.table(Object.entries(frequencies(gameCountByHour(segment))).sort());
  console.log();


  const nonResignedGames = segment.filter(g => !g.log.some(l => l.action.type === 'resign'));
  const lengths = frequencies(gameLengths(nonResignedGames));

  console.log('Game length histogram for non-resigned games');
  histogram(lengths, 100);
  console.log();

  const realLengths = frequencies(realTimeLengths(nonResignedGames));
  console.log('Game lengths in minutes (non-resigned only)');
  histogram(realLengths, 60);
  console.log();

  console.log(`Game results by player name${segmentName === 'AI Games' ? ' (ignoring resigned games vs AI)' : ''}`);
  console.table(
    Object.entries(gameResultsByPlayer(segmentName === 'AI Games' ? nonResignedGames : segment))
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
rulesets = rulesets.length ? rulesets : ['2.4', '2.4.1', '2.4.2', '2.4.3', '2.4.4'];

const games = JSON.parse(fs.readFileSync('games.json'));
//const nonTestGames = games.filter(g => !g.players.map(p => p.name).join().match(/paul|test/i));
const finishedGames = games.filter(g => g.gameState === 'finished');
const currentVersionGames = finishedGames.filter(g => rulesets.includes(g.ruleset));
const aiGames = currentVersionGames.filter(g => g.players.find(p => p.aiController));
const humanGames = currentVersionGames.filter(g => !g.players.find(p => p.aiController));

console.log(`Total records ingested: ${games.length}`);
console.log(`Including games with rulesets: ${JSON.stringify(rulesets)}`);

statsForSegment(aiGames, 'AI Games');
statsForSegment(humanGames, 'Two-player Games');
