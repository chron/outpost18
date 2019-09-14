/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
require('dotenv').config();
const faunadb = require('faunadb');
const fs = require('fs');

const { query, Client } = faunadb;
const { Index, Get, Var, Match, Lambda, Map, Paginate } = query;

async function dump(secret, path) {
  const client = new Client({ secret });

  const r = await client.query(
    Map( // TODO: once we hit this limit we need to do actual pagination I guess
      Paginate(Match(Index('all_games')), { size: 1000 }),
      Lambda('game', Get(Var('game')))
    )
  );

  const json = r.data.map(game => game.data);
  fs.writeFileSync(path, JSON.stringify(json), (err) => {
    if (err) { console.error(err); }
  });
}

if (!process.env.FAUNADB_SECRET_KEY) {
  throw new Error('FAUNADB_SECRET_KEY not set!');
}

dump(process.env.FAUNADB_SECRET_KEY, 'database.json');
