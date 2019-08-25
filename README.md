# Unofficial Digital Outpost 18

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ca17db6-f3f8-492f-ba65-403d810ab3c2/deploy-status)](https://app.netlify.com/sites/outpost18/deploys)

## TODO

1. Start of turn discard
1. Complicated function abilities
1. Use localStorage or something in dev mode instead of Fauna
1. Undo and "are you sure?" warnings
1. Event log?
1. Real-time comms — Pusher?
1. Tooltips and viewing the contents of the discard pile (make sure top is face-up)
1. Card art, human-friendly text, and layout
1. Animations!
1. Auth / Login?
1. Game lobby / join code
1. Highlight abilities where the threshold is met
1. DragPreview for cards - remove opacity at least?
1. Dragged cards take a split second before they disappear which looks weird

## Dev setup

1. `yarn install`
1. `npm install netlify-cli -g`
1. `netlify init` and login so you'll have access to the environment variables
1. `netlify dev`
1. Browse to http://localhost:8888

## Environment Variables

* FAUNADB_SECRET_KEY

## Thanks etc

* PixelMix font by Andrew Tyler (CC by-sa Attribution Share Alike)
* Background SVG tile from Steve Schoger's [Hero Patterns](https://www.heropatterns.com/)
