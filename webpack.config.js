const path = require('path');

module.exports = {
  entry: './src/factory.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname),
    filename: "index.js",
    library: 'DataSmelter',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './'
  },
  watch: true
};