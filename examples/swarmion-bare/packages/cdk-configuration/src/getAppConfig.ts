import type { Construct } from 'constructs';

import { AppStage, getAppStage } from './getAppStage';

export interface AppConfig {
  restApiConfig: {
    allowedOrigins: string[];
  };
}

/**
 * A set of shared parameters, scoped by stage. You can extend them to add other shared parameters between services.
 *
 */

const appConfigMap: Record<AppStage, AppConfig> = {
  dev: {
    restApiConfig: {
      allowedOrigins: ['http://localhost:3000'],
    },
  },
  staging: {
    restApiConfig: {
      allowedOrigins: ['https://staging.my-domain.com'],
    },
  },
  production: {
    restApiConfig: {
      allowedOrigins: ['https://www.my-domain.com'],
    },
  },
};

export const getAppConfig = (scope: Construct): AppConfig => {
  const stage = getAppStage(scope);

  return appConfigMap[stage];
};
