const K = 30;

export default function calculateEloChange(winnerElo, loserElo) {
  const eloDiff = winnerElo - loserElo;
  const prob = (1.0 / (1.0 + (10 ** (eloDiff / 400))));

  return Math.round(K * (1 - prob));
}
