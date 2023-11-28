import { AppStage } from './getAppStage';

export const getDomainNames = (stage: AppStage): string[] => {
  switch (stage) {
    case 'dev':
      return [];
    case 'staging':
      // while waiting for prod to be unblocked
      return ['staging.swarmion.dev', 'www.swarmion.dev'];
    case 'production':
      return ['www.swarmion.dev'];
  }
};
