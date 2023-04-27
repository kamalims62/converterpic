const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/imageconverter_app"),
    filename: "[name].js",
  },
  module: {
    rules: [
    {
      test: /\.js|.jsx$/,
      exclude: /node_modules/,
      use: "babel-loader",
    },
    {
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
        "postcss-loader",
      ],
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "images",
          },
        },
      ],
    },
  ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};