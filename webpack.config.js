const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: path.join(__dirname, "public/js"),
  },
};
