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
    Map(
      Paginate(Match(Index('all_games'))),
      Lambda('game', Get(Var('game')))
    )
  );

  const json = r.data.map(game => game.data);
  fs.writeFile(path, JSON.stringify(json), (err) => {
    if (err) { console.error(err); }
  });
}

if (!process.env.FAUNADB_SECRET_KEY) {
  throw new Error('FAUNADB_SECRET_KEY not set!');
}

dump(process.env.FAUNADB_SECRET_KEY, 'database.json');
