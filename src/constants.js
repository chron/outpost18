// TODO: probably refactor this away, seems like a waste of time for
// the minimal amount of drag-and-drop we're doing.
export const ItemTypes = {
  CARD: 'card',
};

export const VALID_EVENTS = new Set([
  'START_TUTORIAL',
  'FINISH_TUTORIAL',
]);

// New games will be created using this ruleset
export const ACTIVE_VERSION = '2.4.4';
export const IDENTITY_URL = 'https://outpost18.netlify.com';
export const STARTING_ELO = 1000;
export const RANKED_GAME_SETTINGS = { turnLength: 60, reportResult: true };
export const SEASON_START = '2020-01-01 00:00:00';
