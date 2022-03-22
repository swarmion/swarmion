const generateImportOrderRule = require('../../commonConfiguration/generateImportOrderRule');

module.exports = {
  extends: ['plugin:@swarmion/recommended'],
  rules: generateImportOrderRule(__dirname),
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
