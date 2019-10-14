import { reportFinishedGame } from '../../lib/discordWebhooks';

export default async function gameFinished(gameId, gameState) {
  if (gameState.settings.reportResult) {
    await reportFinishedGame(gameId, gameState);
  }
}
