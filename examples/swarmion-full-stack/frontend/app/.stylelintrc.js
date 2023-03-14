const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate');

module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order'],
  rules: {
    'declaration-no-important': true,
    'order/properties-order': [sortOrderSmacss()],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        // allow mui usage in css-in-js
        'selector-class-pattern': [/Mui\w+/],
      },
    },
  ],
};
