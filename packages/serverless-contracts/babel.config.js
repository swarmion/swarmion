const commonBabelConfig = require('../../commonConfiguration/babel.config');

const plugins = [
  [
    'module-resolver',
    {
      root: ['.'],
      alias: {
        contracts: './contracts',
        types: './types',
        utils: './utils',
      },
    },
  ],
];

module.exports = commonBabelConfig(plugins);
