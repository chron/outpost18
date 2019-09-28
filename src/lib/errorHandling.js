/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-console */
const Sentry = require('@sentry/node');

const { SENTRY_DSN, COMMIT_REF } = process.env;
let sentryInitialized = false;

export function initializeErrorHandling() {
  if (SENTRY_DSN) {
    Sentry.init({ dsn: SENTRY_DSN, release: COMMIT_REF });
    sentryInitialized = true;
  }
}

export async function reportError(error) {
  console.warn(error);

  if (!sentryInitialized) { return; }

  if (typeof error === 'string') {
    Sentry.captureMessage(error);
  } else {
    Sentry.captureException(error);
  }

  await Sentry.flush();
}

export function errorWrapper(handler) {
  return async function (_event, context) {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
      return await handler.call(this, ...arguments);
    } catch (e) {
      await reportError(e);
      throw e;
    }
  };
}
