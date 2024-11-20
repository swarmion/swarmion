module.exports = {
  extends: ['plugin:@swarmion/recommended'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: __dirname,
      },
    },
  },
};
