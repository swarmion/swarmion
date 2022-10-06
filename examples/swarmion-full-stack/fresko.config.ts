import { declareConfiguration } from 'fresko';

export default declareConfiguration({
  prompts: [
    // Every time the pnpm-lock.yaml file is updated, fresko will offer to run `pnpm install`
    {
      path: 'pnpm-lock.yaml',
      command: 'pnpm install',
    },
  ],
});
