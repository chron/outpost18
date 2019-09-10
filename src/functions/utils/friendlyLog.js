const LOG_LENGTH = 10;

export default function friendlyLog(state, currentPlayerId) {
  const { log } = state;

  const formattedLog = log.slice(0, LOG_LENGTH).map(message => {
    const { playerId, ...rest } = message;
    return { ...rest, actor: playerId === currentPlayerId ? 'player' : 'opponent' };
  });

  return formattedLog.reverse();
}
