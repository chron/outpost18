import { query, Client } from 'faunadb';

const { Collection, Ref, Create, Get, Replace } = query;

// TODO: error if the environment variable is not set, e.g. we haven't done `netlify init`
const client = new Client({ secret: process.env.FAUNADB_SECRET_KEY });
const COLLECTION_NAME = 'games';

// Returns a promise that resolves to the gameId
export function createGame(data) {
  return client
    .query(Create(Collection(COLLECTION_NAME), { data }))
    .then(response => response.ref.id)
    .catch(e => console.error(e)); // TODO: error handling, bugsnag or something here?
}

export function loadGame(gameId) {
  return client
    .query(Get(Ref(Collection(COLLECTION_NAME), gameId)))
    .then(r => r.data)
    .catch(e => console.error(e));
}

export function saveGame(gameId, data) {
  return client
    .query(Replace(Ref(Collection(COLLECTION_NAME), gameId), { data }))
    .then(r => r.data)
    .catch(e => console.error(e));
}
