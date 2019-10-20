export default function playerPresenter(playerData, season) {
  const {
    name,
    playerId,
    games,
    tags,
  } = playerData;

  return {
    name,
    playerId,
    games: games[season],
    tags,
  };
}
