import { STARTING_ELO, SEASON_START } from '../constants';

function getWeek(date) {
  var onejan = new Date(date.getFullYear(), 0, 1);
  var millisecsInDay = 86400000;
  return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
};

function seasonAt(time) {
  if (time < new Date(SEASON_START)) {
    return 'preseason';
  } else {
    const fortnight = Math.ceil(getWeek(time) / 2);
    return `season-${time.getFullYear()}-f${fortnight}`;
  }
}

export function currentSeason() {
  return seasonAt(new Date());
}

export function initialSeasonData() {
  return {
    wins: 0,
    losses: 0,
    elo: STARTING_ELO,
  };
}
