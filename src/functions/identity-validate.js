import { loadPlayerByEmail, loadPlayerByName } from '../lib/database';
import { initializeErrorHandling, errorWrapper } from '../lib/errorHandling';
import { renderError } from './utils/apiResponses';

async function handler(apiEvent, _context) {
  const { user: { user_metadata: { name }, email } } = JSON.parse(apiEvent.body);

  if (!name || name === '') { return renderError('No name provided.'); }
  if (!email || email === '') { return renderError('No email provided.'); }

  const [nameMatch, _p1] = await loadPlayerByName(name);

  if (nameMatch) { return renderError('Name is taken.'); }

  const [emailMatch, _p2] = await loadPlayerByEmail(email);

  if (emailMatch) { return renderError('Email address is taken.'); }

  return {
    statusCode: 204,
    body: '',
  };
}

initializeErrorHandling();
exports.handler = errorWrapper(handler);
