import { query, Client } from 'faunadb';

require('dotenv').config();
/* eslint-disable no-console */

const { Collection, Index, Ref, Create, Get, Var, Replace, Match, Lambda, Map, Paginate } = query;

// TODO: error if the environment variable is not set, e.g. we haven't done `netlify init`
// TODO: find a way to switch the var out rather than using two different ones!!
const secret = process.env.FAUNADB_SECRET_KEY_DEV || process.env.FAUNADB_SECRET_KEY;
const client = new Client({ secret });
const COLLECTION_NAME = 'games';

export async function createGame(data) {
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

export async function allPublicAndWaitingGames() {
  try {
    const r = await client.query(
      Map(
        Paginate(Match(
          Index('games_by_privacy_and_state'),
          true,
          'waiting'
        )),
        Lambda('game', Get(Var('game')))
      )
    );

    return r.data.map(game => game.data);
  } catch (e) {
    return console.error(e);
  }
}

export async function loadGameByJoinCode(joinCode) {
  try {
    const r = await client.query(
      Map(
        Paginate(Match(Index('games_by_join_code'), joinCode.toUpperCase())),
        Lambda('game', Get(Var('game')))
      )
    );

    if (r.data[0]) {
      return [r.data[0].ref.id, r.data[0].data];
    } else {
      return [];
    }
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
