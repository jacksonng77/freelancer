const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/freelancer/",
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/client.html", to: "client.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
