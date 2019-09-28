// This webpack config is currently only used for netlify-lambda
// The main app is bundled using Parcel!
var webpack = require('webpack');
const { COMMIT_REF } = process.env;

/* fix for https://medium.com/@danbruder/typeerror-require-is-not-a-function-webpack-faunadb-6e785858d23b */
module.exports = {
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new webpack.DefinePlugin({
      'process.env.COMMIT_REF': JSON.stringify(COMMIT_REF),
    }),
  ],
  node: {
    __dirname: true,
  }
}
