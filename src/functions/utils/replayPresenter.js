// TODO: this doesn't feel very DRY
const PLAYER_ACTIONS = [
  'discard',
  'play',
  'attack',
  'destroy',
  'endTurn',
  'timeout',
  'resign',
];

export default function replayPresenter(state, gameId) {
  const {
    ruleset,
    players,
    log,
    winner,
    resigned,
    createdAt,
    startedAt,
    finishedAt,
    settings,
    seed,
  } = state;

  const playerActionsOnly = log.filter(({ action: { type } }) => {
    return PLAYER_ACTIONS.includes(type);
  });

  return {
    gameId,
    ruleset,
    winner,
    resigned,
    players: players.map(p => ({
      playerId: p.playerId,
      name: p.name,
    })),
    createdAt,
    startedAt,
    finishedAt,
    settings,
    log: playerActionsOnly,
    seed,
  };
}
