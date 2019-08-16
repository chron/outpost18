import faunadb from 'faunadb';

const { Create, Collection } = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });
const COLLECTION_NAME = 'games';

// Returns a promise that resolves to the gameId
export function createGame(data) {
  return client
    .query(Create(Collection(COLLECTION_NAME), { data }))
    .then(response => response.ref.id)
    .catch(e => console.log(e)); // TODO: error handling, bugsnag or something here?
}

export function loadGame(gameId) {
  console.log('TODO');
  return {};
}
