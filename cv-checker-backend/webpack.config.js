const path = require("path");
const slsw = require("serverless-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  devtool: "nosources-source-map",
  externals: [nodeExternals()],
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "bin/",
        to: "bin/"
      },
      {
        from: "cv/",
        to: "cv/"
      }
    ])
  ],
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map"
  }
};
