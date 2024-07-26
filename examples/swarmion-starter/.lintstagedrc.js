export default {
  '*': 'prettier --ignore-unknown --write',
  '*.{js,ts}': 'pnpm lint-fix',
};
