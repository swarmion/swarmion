module.exports = {
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['@docusaurus'],
  extends: ['plugin:@docusaurus/recommended'],
};
