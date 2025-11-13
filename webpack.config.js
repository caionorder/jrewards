// webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "rewards.min.js",
    path: path.resolve(__dirname, "./build"),
    library: {
      name: "Groone Rewards",
      type: "window", // Alterado para 'window' em vez de 'umd'
      export: "default",
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          format: {
            comments: false,
          },
          compress: {
            drop_console: true, // Remove todas as chamadas de console
          },
        },
        extractComments: false,
      }),
    ],
  },
};
