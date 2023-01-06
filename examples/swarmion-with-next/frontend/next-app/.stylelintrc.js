const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate');

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: {
    'declaration-no-important': true,
    'order/properties-order': [sortOrderSmacss()],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      customSyntax: '@stylelint/postcss-css-in-js',
      rules: {
        // allow mui usage in css-in-js
        'property-no-unknown': [true, { ignoreProperties: ['name'] }],
        'function-no-unknown': [
          true,
          { ignoreFunctions: ['/^(\\$\\{)?theme\\./'] },
        ],
        'value-keyword-case': ['lower', { ignoreProperties: ['name'] }],
        'selector-class-pattern': [/Mui(-)?\w+/],
      },
    },
  ],
};
