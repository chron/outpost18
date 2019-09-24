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
        name: 'all_games',
        source: Collection('games'),
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

  try {
    await client.query(
      CreateIndex({
        name: 'games_by_privacy_and_state',
        source: Collection('games'),
        terms: [
          { field: ['data', 'publicGame'] },
          { field: ['data', 'gameState'] },
        ],
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
        name: 'active_games_for_player',
        source: Collection('games'),
        terms: [
          { field: ['data', 'players', 'playerId'] },
          { field: ['data', 'gameState'] },
        ],
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
        name: 'games_sort_by_finished_at_desc',
        source: Collection('games'),
        terms: [
          { field: ['ref'] },
        ],
        values: [
          { field: ['data', 'finishedAt'], reverse: true },
          { field: ['ref'] },
        ],
      })
    );
  } catch (e) {
    if (e.message !== 'instance already exists') {
      console.error(e);
    }
  }
}

// TODO: switching this between _DEV and prod keys is cumbersome
const key = process.env.FAUNADB_SECRET_KEY_DEV;

if (!key) {
  throw new Error('FAUNADB_SECRET_KEY not set!');
}

bootstrapDatabase(key);
