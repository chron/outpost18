export function renderError(error) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error }),
  };
}
