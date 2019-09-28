import { query, Client } from 'faunadb';

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
/* eslint-disable no-console */

const {
  Collection,
  Index,
  Ref,
  Create,
  Get,
  Var,
  Replace,
  Match,
  Union,
  Lambda,
  Map,
  Paginate,
  Join,
  Delete,
} = query;

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

export async function deleteGame(gameId) {
  try {
    await client.query(Delete(Ref(Collection(COLLECTION_NAME), gameId)));
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function loadActiveGame(playerId) {
  try {
    const r = await client.query(
      Map(
        Paginate(
          Union(
            Match(Index('active_games_for_player'), playerId, 'main'),
            Match(Index('active_games_for_player'), playerId, 'waiting'),
            Match(Index('active_games_for_player'), playerId, 'begin')
          )
        ),
        Lambda('game', Get(Var('game')))
      )
    );

    if (r.data && r.data[0]) {
      return [r.data[0].ref.id, r.data[0].data];
    } else {
      return [];
    }
  } catch (e) {
    return console.error(e);
  }
}

export async function allOpenGames() {
  try {
    const r = await client.query(
      Map(
        Paginate(Match(
          Index('games_by_privacy_and_state'),
          true,
          'waiting'
        )),
        Lambda('ref', Get(Var('ref')))
      )
    );

    return r.data.map(game => game.data);
  } catch (e) {
    return console.error(e);
  }
}

export async function recentFinishedGames() {
  try {
    const r = await client.query(
      Map(
        Paginate(
          Join(
            Match(
              Index('games_by_privacy_and_state'),
              true,
              'finished'
            ),
            Index('games_sort_by_finished_at_desc')
          ),
          { size: 10 }
        ), Lambda(['game', 'ref'], Get(Var('ref')))
      )
    );


    return r.data.map(game => [game.ref.id, game.data]);
  } catch (e) {
    console.error(e);
    return [];
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
