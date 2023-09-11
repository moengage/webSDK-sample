const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 4111,
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    // contentBase: path.resolve(__dirname, 'build'),
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
};