/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
require('dotenv').config();
const faunadb = require('faunadb');

const { Client, query: { Collection, CreateCollection, CreateIndex } } = faunadb;

async function bootstrapDatabase(secret) {
  const client = new Client({ secret });

  try {
    await client.query(
      CreateCollection({
        name: 'games',
      })
    );
  } catch (e) {
    if (e.message !== 'instance already exists') {
      console.error(e);
    }
  }

  try {
    await client.query(
      CreateIndex({
        name: 'games_by_join_code',
        source: Collection('games'),
        terms: [{ field: ['data', 'joinCode'] }],
        unique: true,
      })
    );
  } catch (e) {
    if (e.message !== 'instance already exists') {
      console.error(e);
    }
  }
}

if (!process.env.FAUNADB_SECRET_KEY) {
  throw new Error('FAUNADB_SECRET_KEY not set!');
}

bootstrapDatabase(process.env.FAUNADB_SECRET_KEY);

console.log('Finished!');
