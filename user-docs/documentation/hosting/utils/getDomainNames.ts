import { AppStage } from './getAppStage';

export const getDomainNames = (stage: AppStage): string[] => {
  switch (stage) {
    case 'dev':
      return [];
    case 'staging':
      // while waiting for prod to be unblocked
      return ['staging.swarmion.dev', 'docs.swarmion.dev'];
    case 'production':
      return [];
  }
};
