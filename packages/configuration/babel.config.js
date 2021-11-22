const commonBabelConfig = require('../../commonConfiguration/babel.config');

const plugins = ['@babel/plugin-transform-runtime'];

module.exports = commonBabelConfig(plugins);
