import type { Construct } from 'constructs';

import { CdkDeploymentError } from 'customErrors';

const defaultStage = 'dev' as const;

const APP_STAGES = [defaultStage, 'staging', 'production'] as const;
export type AppStage = typeof APP_STAGES[number];

const isAppStage = (stage: string): stage is AppStage => {
  return APP_STAGES.includes(stage as AppStage);
};

export const getAppStage = (scope: Construct): AppStage => {
  const stage = scope.node.tryGetContext('stage') as string | undefined;

  if (stage === undefined) {
    return defaultStage;
  }

  if (!isAppStage(stage)) {
    throw new CdkDeploymentError(
      `Invalid stage: ${stage}. Must be one of ${APP_STAGES.join(', ')}`,
    );
  }

  return stage;
};
