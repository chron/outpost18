import { deleteGame } from '../../lib/database';
import { refreshLobby } from '../utils/notify';

export default async function gameCancelled(gameId, gameState) {
  await deleteGame(gameId);

  if (gameState.publicGame) {
    // A waiting game was abandoned so we should refresh the lobby
    // TODO: can we do this async without the function terminating?
    await refreshLobby();
  }
}
