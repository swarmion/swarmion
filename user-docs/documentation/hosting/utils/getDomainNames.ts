import { AppStage } from './getAppStage';

export const getDomainNames = (stage: AppStage): string[] => {
  switch (stage) {
    case 'dev':
      return [];
    case 'staging':
      return ['staging.swarmion.dev'];
    case 'production':
      return ['swarmion.dev', 'www.swarmion.dev'];
  }
};
