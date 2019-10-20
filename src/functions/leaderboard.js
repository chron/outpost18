import { loadLeaderboard } from '../lib/database';
import { currentSeason } from '../logic/seasonManagement';
import playerPresenter from './utils/playerPresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';

async function handler(event, _context) {
  const { season } = event.queryStringParameters;

  const seasonToShow = season || currentSeason();
  const players = await loadLeaderboard(seasonToShow, 10);

  return {
    statusCode: 200,
    body: JSON.stringify(players.map(g => playerPresenter(g, seasonToShow))),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
