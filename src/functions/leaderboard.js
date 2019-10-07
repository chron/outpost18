import { loadLeaderboard } from '../lib/database';
import playerPresenter from './utils/playerPresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(_event, _context) {
  const players = await loadLeaderboard(10);

  console.log(players);

  return {
    statusCode: 200,
    body: JSON.stringify(players.map(g => playerPresenter(g))),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
