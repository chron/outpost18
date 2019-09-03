# Unofficial Digital Outpost 18

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ca17db6-f3f8-492f-ba65-403d810ab3c2/deploy-status)](https://app.netlify.com/sites/outpost18/deploys)

## TODO

1. Remove gameId from local storage once a game finishes?
1. Filter visible state to only what players should be able to see
1. Game lobby / join code
1. Complicated function abilities
1. Use localStorage or something in dev mode instead of Fauna - and dev Pusher environment too!
1. Move `cards` out of the context since it never changes?
1. Undo and "are you sure?" warnings
1. Event log?
1. Tooltips and viewing the contents of the discard pile
1. Error handling, probably a React ErrorBoundary?
1. Card art, human-friendly text, and layout
1. Animations!
1. Auth / Login?
1. Highlight abilities where the threshold is met
1. DragPreview for cards - remove opacity at least?
1. Dragged cards take a split second before they disappear which looks weird

## Dev setup

1. `yarn install`
1. `npm install netlify-cli -g`
1. `netlify init` and login so you'll have access to the environment variables
1. `netlify dev`
1. Browse to http://localhost:8888

## Seeding a new database

(TODO: make an idempotent script to do this)

1. Create a database called `outpost18`
1. Create a collection called `games`

## Environment Variables

* FAUNADB_SECRET_KEY
* PUSHER_APP_ID
* PUSHER_KEY
* PUSHER_SECRET
* PUSHER_CLUSTER

## Thanks etc

* PixelMix font by Andrew Tyler (CC by-sa Attribution Share Alike)
* Background SVG tile from Steve Schoger's [Hero Patterns](https://www.heropatterns.com/)
