const path = require('path');

module.exports = {
  // path to our input files (can be multiple)
  entry: {
    //'new1-bundle': './assets/js/new1.js',
    //'new2-bundle': './assets/js/new2.js',
    'index-bundle': './assets/js/index.js',
  },
  output: {
    filename: '[name].js',  // output bundle file name (name will be the key from entry section)
    path: path.resolve(__dirname, '../../../digital-shop-app/static/js'),  // path to our Django static directory
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
  },
  devServer: {
    port: 9000,
    historyApiFallback: true,
  },
};
