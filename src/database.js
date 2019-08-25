/* eslint-disable no-console */
import { query, Client } from 'faunadb';

const { Collection, Ref, Create, Get, Replace } = query;

// TODO: error if the environment variable is not set, e.g. we haven't done `netlify init`
const client = new Client({ secret: process.env.FAUNADB_SECRET_KEY });
const COLLECTION_NAME = 'games';

export async function createGame(data) {
  console.log(process.env.FAUNADB_SECRET_KEY);

  try {
    const response = await client.query(Create(Collection(COLLECTION_NAME), { data }));
    return response.ref.id;
  } catch (e) {
    // TODO: error handling, bugsnag or something here?
    return console.error(e);
  }
}

export async function loadGame(gameId) {
  try {
    const r = await client.query(Get(Ref(Collection(COLLECTION_NAME), gameId)));
    return r.data;
  } catch (e) {
    return console.error(e);
  }
}

export async function saveGame(gameId, data) {
  try {
    const r = await client.query(Replace(Ref(Collection(COLLECTION_NAME), gameId), { data }));
    return r.data;
  } catch (e) {
    return console.error(e);
  }
}
