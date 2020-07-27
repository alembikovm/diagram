const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    modules: [path.resolve(__dirname, "./src"), "node_modules"],
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      components: path.resolve("src/components"),
    },
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.min.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
