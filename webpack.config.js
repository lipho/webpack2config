const isProduction = process.env.NODE_ENV === 'production';

const configs = {
  prod: require('./webpack.prod.config'),
  dev: require('./webpack.dev.config')
};

module.exports = isProduction ? configs.prod : configs.dev;
