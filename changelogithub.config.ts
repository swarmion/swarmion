import { defineConfig } from 'changelogithub';

// Defaults are defined here: https://github.com/antfu/changelogithub/blob/main/src/config.ts#L8
export default defineConfig({
  types: {
    feat: { title: '🚀 Features' },
    fix: { title: '🐞 Bug Fixes' },
    examples: { title: '🏀 Examples' },
  },
});
