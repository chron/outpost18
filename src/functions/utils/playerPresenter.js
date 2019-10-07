export default function playerPresenter(playerData) {
  const {
    name,
    playerId,
    games,
  } = playerData;

  return {
    name,
    playerId,
    games,
  };
}
