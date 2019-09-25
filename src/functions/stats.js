import { allFinishedGames } from '../lib/database';
import statsPresenter from './utils/statsPresenter';

export async function handler(_event, _context) {
  const games = await allFinishedGames();

  return {
    statusCode: 200,
    body: JSON.stringify(statsPresenter(games)),
  };
}
