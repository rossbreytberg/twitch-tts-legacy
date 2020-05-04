const path = require("path");

module.exports = {
  entry: "./node_modules.js",
  output: {
    filename: "node_modules.js",
    path: path.resolve(__dirname, "src/lib/node_modules"),
  },
};
