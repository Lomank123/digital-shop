const path = require('path');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin(['GOOGLE_KEY']),
  ],
  // path to our input files (can be multiple)
  entry: {
    'index-bundle': './assets/js/index.js',
  },
  output: {
    filename: '[name].js',  // output bundle file name (name will be the key from entry section)
    path: path.resolve(__dirname, '../assets/ready-build/scripts'),  // path to our Django static directory
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ]
  }
};
