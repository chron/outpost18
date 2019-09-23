# Unofficial Digital Outpost 18

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ca17db6-f3f8-492f-ba65-403d810ab3c2/deploy-status)](https://app.netlify.com/sites/outpost18/deploys)

## What is Outpost 18?

Outpost is a micro-cardgame designed by Adam Wilk.  The description from the [official site](http://playoutpost18.com):

> Humanity has reached the asteroid belt. Warring nations fight for control over an endless cache of ion and ore. Supplies this far deep in space are limited, so each reinforcement must be deployed carefully. Make the wrong choice and you’ll end up lost in the expanse beyond.
>
> In this turn based 18-card strategy game, players build their space station and fleet from dual-purpose supply cards. Each card is a choice deployed as either an upgrade to their station or a ship in their fleet.
>
> Outpost 18 plays in 10-15 minutes and is designed to scratch the dueling strategy game itch. Opt for ore-based tactics to play aggressively, ion-based tactics to flood the field with effects and abilities, or labour-based tactics to overwhelm with card advantage.

## Architecture

The frontend of the game is a React app, bundled using Parcel and hosted on Netlify.  The backend of the game is serverless Node functions, hosted on Netlify's "functions" service which is a convenience wrapper around AWS Lambda and works much the same way.  Real-time communications are handled via a Pusher websocket.  All persistence is handled by FaunaDB which is a JSON document store similar to Mongo or DynamoDB.

The server operates as a stateless reducer, loading data from Fauna and saving it back after applying the game logic based on the dispatched action.  It's my first time writing so much Functional Programming-ish JS, so that part is probably a bit messy.

The great part about this setup is a lot of the logic can be re-used by both client and server.

There's no auth yet but I think Netlify Identity will probably be a good solution if we go down that route eventually!

## Running locally

1. `yarn install`
1. `npm i -g netlify-cli`
1. `netlify init` and login so you'll have access to the environment variables
1. `netlify dev`
1. Browse to http://localhost:8888

## Seeding a new database

1. `yarn run db:bootstrap`

## Environment Variables

Netlify will load the variables locally so the only one you will need on your machine is `FAUNADB_SECRET_KEY` if you're going to run the `db:dump` yarn task.

| Environment Variable | Description |
| --- | --- |
| COMMIT_REF | Git SHA of the current HEAD, used as a version code on the live site |
| FAUNADB_SECRET_KEY_DEV | dev key for Fauna, set in your local .env|
| FAUNADB_SECRET_KEY | prod key for Fauna, comes from Netlify |
| PUSHER_APP_ID | Pusher App used by the server-side websocket connection |
| PUSHER_KEY | Pusher Key used by websocket client and server |
| PUSHER_SECRET ||
| PUSHER_CLUSTER ||

## Credits

* Adam Wilk (ANGRYCYBORGGAMES) for the game itself, as well as numerous suggestions and extensive playtesting.
* PixelMix font by [Andrew Tyler](http://www.andrewtyler.net/)
* Ship art by [Wuhu on Open Game Art](https://opengameart.org/content/spaceships-1)
* Background SVG tile from Steve Schoger's [Hero Patterns](https://www.heropatterns.com/)
