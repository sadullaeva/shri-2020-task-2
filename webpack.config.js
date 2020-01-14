const path = require('path');

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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};