import { declareConfiguration } from 'fresko';

export default declareConfiguration({
  prompts: [
    // Every time the yarn.lock file is updated, fresko will offer to run `yarn install`
    {
      path: 'yarn.lock',
      command: 'yarn install',
    },
  ],
});
