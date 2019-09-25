export default function statsPresenter(games) {
  const segments = {
    humanGames: games.filter(g => !g.players.find(p => p.aiController)),
    aiGames: games.filter(g => g.players.find(p => p.aiController)),
  };

  return Object.entries(segments).reduce((data, [segmentName, segment]) => {
    const { playFirst, playSecond } = segment.reduce((memo, game) => {
      const winner = game.activePlayer;
      const firstPlayer = game.players[0].playerId;

      return {
        playFirst: memo.playFirst + (winner === firstPlayer ? 1 : 0),
        playSecond: memo.playSecond + (winner === firstPlayer ? 0 : 1),
      };
    }, { playFirst: 0, playSecond: 0 });

    return {
      ...data,
      [segmentName]: {
        firstPlayerAdvantage: [
          { name: 'Play First', value: playFirst },
          { name: 'Play Second', value: playSecond },
        ],
      },
    };
  }, {});
}
