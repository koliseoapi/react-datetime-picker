/**
Compile the example file.
This is needed only to check things manually using the browser. 
The automated tests use Mocha and Babel without going through Babel.
*/

const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: {
    app: './example/app.js',
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    publicPath: '/build/',
    filename: 'app.js' 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              'react', 
              // needed for tree shaking
              // see https://medium.com/modus-create-front-end-development/webpack-2-tree-shaking-configuration-9f1de90f3233
              ["es2015", { "modules": false }]
            ],
            plugins: ['lodash']
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new WebpackNotifierPlugin({ excludeWarnings: true, alwaysNotify: true }),
  ]
};