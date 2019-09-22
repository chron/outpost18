const LOG_LENGTH = 10;

export default function friendlyLog(state, currentPlayerId) {
  const { log } = state;

  const formattedLog = log.slice(-LOG_LENGTH).map(message => {
    const { playerId, action: { type, ...rest } } = message;
    const data = type === 'shuffle' ? {} : rest; // Don't show players the deck contents
    return { action: { type, ...data }, actor: playerId === currentPlayerId ? 'player' : 'opponent' };
  });

  return formattedLog;
}
