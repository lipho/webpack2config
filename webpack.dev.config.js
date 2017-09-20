const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const devServer = {
  quiet: false,
  progress: true,
  inline: true,
  colors: true,
  historyApiFallback: {
    index: './static/index.html'
  },
  hot: true,
  host: '0.0.0.0'
};

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    title: 'Mimo Back Office',
    template: 'frontend/src/idx-template.ejs',
  }),
  /*  new HtmlWebpackPlugin({
   title: 'Login To Mimo Back Office',
   template: 'frontend/src/LoginEntry/login.ejs',
   }),*/
  new webpack.optimize.CommonsChunkPlugin('app', 'app.commons.js'),
  new ExtractTextPlugin("[name].css")
];

const entry = {
  app: [
    'react-hot-loader/patch',
    './frontend/src/index.jsx',
  ],
  /*  login: [
   'react-hot-loader/patch',
   './frontend/src/LoginEntry'
   ]*/
};

const devtool = 'cheap-module-source-map';
const output = {
  path: path.join(__dirname, 'static'),
  filename: '[name].js',
  publicPath: '/'
};

module.exports = {
  // context: __dirname,
  devtool,
  output,
  entry,
  module: {
    preLoaders: [
      //Eslint loader
      { test: /\.(js|jsx)?$/, exclude: /node_modules/, loader: "eslint-loader" },
    ],
    loaders: [
      { test: /\.html$/, loader: "file?name=[name].[ext]" },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: !isProduction,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: !isProduction ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            // CSS Nano http://cssnano.co/options/
            minimize: isProduction,
          })}`,
          'postcss-loader',
        ],
        exclude: /style\.css$/,
      },
      { test: /style\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      {
        test: /\.(jpe?g|png|gif)$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.(js|jsx)?$/,
        exclude: [/node_modules/, /backend/],
        loaders: ['babel'],
        presets: ['es2016', 'react'],
      },
    ],
  },
  postcss(bundler) {
    return [
      // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
      // https://github.com/postcss/postcss-import
      require('postcss-import')({ addDependencyTo: bundler }),
      // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
      // https://github.com/postcss/postcss-custom-properties
      require('postcss-custom-properties')(),
      // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
      // https://github.com/postcss/postcss-custom-media
      require('postcss-custom-media')(),
      // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
      // https://github.com/postcss/postcss-media-minmax
      require('postcss-media-minmax')(),
      // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
      // https://github.com/postcss/postcss-custom-selectors
      require('postcss-custom-selectors')(),
      // W3C calc() function, e.g. div { height: calc(100px - 2em); }
      // https://github.com/postcss/postcss-calc
      require('postcss-calc')(),
      // Allows you to nest one style rule inside another
      // https://github.com/jonathantneal/postcss-nesting
      require('postcss-nesting')(),
      // W3C color() function, e.g. div { background: color(red alpha(90%)); }
      // https://github.com/postcss/postcss-color-function
      require('postcss-color-function')(),
      // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
      // https://github.com/iamvdo/pleeease-filters
      require('pleeease-filters')(),
      // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
      // https://github.com/robwierzbowski/node-pixrem
      require('postcss-selector-matches')(),
      // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
      // https://github.com/postcss/postcss-selector-not
      require('postcss-selector-not')(),
      // Postcss flexbox bug fixer
      // https://github.com/luisrudge/postcss-flexbugs-fixes
      require('postcss-flexbugs-fixes')(),
      // Add vendor prefixes to CSS rules using values from caniuse.com
      // https://github.com/postcss/autoprefixer
      require('autoprefixer')(),
    ];
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins,
  eslint: {
    configFile: './.eslintrc'
  },
  devServer,
  target: 'web'
};