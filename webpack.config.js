const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: {
    app: ['./index.js']
  },
  node: {
    path: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'linter.js'
  },
  externals: [nodeExternals()]
};