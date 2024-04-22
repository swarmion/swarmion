module.exports = {
  '*': 'prettier --ignore-unknown --write',
  '*.{js,ts}': 'corepack pnpm lint-fix',
};
