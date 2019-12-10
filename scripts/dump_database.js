/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
require('dotenv').config();
const faunadb = require('faunadb');
const fs = require('fs');

const { query, Client } = faunadb;
const { Index, Get, Var, Match, Lambda, Map, Paginate } = query;

async function dump(secret, index, path) {
  const client = new Client({ secret });

  const r = await client.query(
    Map( // TODO: once we hit this limit we need to do actual pagination I guess
      Paginate(Match(Index(index)), { size: 100000 }),
      Lambda('ref', Get(Var('ref')))
    )
  );

  const json = r.data.map(game => game.data);
  fs.writeFileSync(path, JSON.stringify(json), (err) => {
    if (err) { console.error(err); }
  });
}

const secret = process.env.FAUNADB_SECRET_KEY;

if (!secret) {
  throw new Error('ENV VARfs not set!');
}

dump(secret, 'all_games', 'games.json');
dump(secret, 'all_user_events', 'user_events.json');
dump(secret, 'all_players', 'players.json');
