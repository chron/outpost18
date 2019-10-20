export default function playerPresenter(playerData, season) {
  const {
    name,
    playerId,
    games,
  } = playerData;

  return {
    name,
    playerId,
    games: games[season],
  };
}
