/**
Compile the example file.
This is needed only to check things manually using the browser. 
The automated tests use Mocha and Babel without going through Babel.
*/

const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");

module.exports = {
  entry: {
    app: "./example/app.js"
  },
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    publicPath: "/build/",
    filename: "app.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/react", "@babel/env"]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new WebpackNotifierPlugin({ excludeWarnings: true, alwaysNotify: true })
  ]
};
