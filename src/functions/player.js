import { loadPlayerByName } from '../lib/database';
import { currentSeason } from '../logic/seasonManagement';
import playerPresenter from './utils/playerPresenter';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';
import { renderError } from './utils/apiResponses';

async function handler(event, _context) {
  const { playerName, season } = event.queryStringParameters;
  if (!playerName) { return renderError('Player Name must be specified.'); }

  const [_ref, playerData] = await loadPlayerByName(playerName);
  const seasonToShow = season || currentSeason();

  return {
    statusCode: 200,
    body: JSON.stringify({
      player: playerPresenter(playerData, seasonToShow),
      season: seasonToShow,
    }),
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
