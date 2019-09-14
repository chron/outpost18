export default function log(state, message) {
  const newLog = (state.log || []).concat(message);

  return { ...state, log: newLog };
}
