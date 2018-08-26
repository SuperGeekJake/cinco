const webpack = require("webpack");

const environment = process.env.NODE_ENV || "development";
module.exports = {
  mode: environment,
  entry: {
    main: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "./src/main.js"
    ]
  },
  output: {
    path: "/",
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
