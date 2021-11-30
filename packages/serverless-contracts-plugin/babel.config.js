const commonBabelConfig = require('../../commonConfiguration/babel.config');

const plugins = [
  [
    'module-resolver',
    {
      root: ['.'],
      alias: {
        plugins: './plugins',
        types: './types',
      },
    },
  ],
];

module.exports = commonBabelConfig(plugins);
