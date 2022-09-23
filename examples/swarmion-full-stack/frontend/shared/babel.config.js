const commonBabelConfig = require('../../commonConfiguration/babel.config');

const presets = [
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
];

module.exports = commonBabelConfig([], presets);
