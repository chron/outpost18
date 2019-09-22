# Unofficial Digital Outpost 18

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ca17db6-f3f8-492f-ba65-403d810ab3c2/deploy-status)](https://app.netlify.com/sites/outpost18/deploys)

Based on [Outpost 18](http://playoutpost18.com)

## Dev setup

1. `yarn install`
1. `npm i -g netlify-cli`
1. `netlify init` and login so you'll have access to the environment variables
1. `netlify dev`
1. Browse to http://localhost:8888

## Seeding a new database

1. `yarn run db:bootstrap`

## Environment Variables

| Environment Variable | Description |
| --- | --- |
| FAUNADB_SECRET_KEY_DEV| dev key for Fauna, set in your local .env|
| FAUNADB_SECRET_KEY| prod key for Fauna, comes from Netlify |
| PUSHER_APP_ID | Pusher App used by the server-side websocket connection |
| PUSHER_KEY | Pusher Key used by websocket client and server |
| PUSHER_SECRET ||
| PUSHER_CLUSTER ||

## Thanks etc

* [Outpost 18](http://playoutpost18.com) crew for the game rules and design
* PixelMix font by Andrew Tyler (CC by-sa Attribution Share Alike)
* Background SVG tile from Steve Schoger's [Hero Patterns](https://www.heropatterns.com/)
