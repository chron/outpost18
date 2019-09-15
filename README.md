# Unofficial Digital Outpost 18

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ca17db6-f3f8-492f-ba65-403d810ab3c2/deploy-status)](https://app.netlify.com/sites/outpost18/deploys)

Based on [Outpost 18](http://playoutpost18.com)

## TODO

1. visual feedback of how much attack was added when assigning attackers
1. add to timer after each action
1. Don't show game alerts when location is /game to avoid that flicker - could do with CSS
1. Maybe make turn timer an option somewhere?
1. Persist preference for game settings in localStorage
1. display 0 attack ships (Lotus) correctly
1. I18n?
1. Ionblazer should let the player choose which card to discard
1. Pick one of the two discard mechanisms and standardize on it
1. "are you sure?" warnings for resigning / ending turn with unspent plays
1. Tooltips and viewing the contents of the discard pile
1. Typesetting and make sure text doesn't overflow the ability boxes.
1. Animations!
1. Auth / Login?
1. DragPreview for cards - remove opacity
1. Dragged cards take a split second before they disappear which looks weird

## Tech debt stuff that might be worthwhile

1. Move dev environment to the dev fauna instance
1. SCSS linting
1. Error handling, probably a React ErrorBoundary?
1. Test suite (Jest? React-testing-library?)
1. Use a proper state machine lib like `xstate` for the server-side game state
1. Use localStorage or something in dev mode instead of Fauna - and dev Pusher environment too!

## Cool ideas that may or may not get implemented

1. Chat
1. Spectators
1. Multiple games at once - tabbed interface?
1. Browser notifs when it becomes your turn and you're not looking

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
