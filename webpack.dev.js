// webpack.config.js
const path = require("path");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/index.ts",
    mode: "development",
    devtool: "source-map",
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
    resolve: { extensions: [".tsx", ".ts", ".js"] },
    output: {
      path: path.resolve(__dirname, "./build-dev"),
      filename: isProd ? "rewards.min.js" : "rewards.js",
      library: { name: "Groone Rewards", type: "window", export: "default" },
    },
    optimization: { 
        minimize: false 
    },
  };
};