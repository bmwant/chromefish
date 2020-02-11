const path = require('path');

module.exports = {
  mode: 'development',
  entry: './contentScript.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'extension'),
    library: "bundle",
    libraryTarget: "umd"
  },
  watch: true,
  // https://github.com/webpack-contrib/css-loader/issues/447
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /stockfish\.asm\.js$/,
        use: ['script-loader']
      }
    ]
  }
};
