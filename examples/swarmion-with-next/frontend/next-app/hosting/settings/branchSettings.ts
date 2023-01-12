import { AutoBranchCreation, BranchOptions } from '@aws-cdk/aws-amplify-alpha';

export const MAIN_BRANCH = 'main';

export const mainBranchSettings: BranchOptions = {
  stage: 'PRODUCTION',
  autoBuild: true,
};

export const branchPreviewConfiguration: AutoBranchCreation = {
  // Define the pattern of branches that will be automatically built and deployed
  patterns: ['feature/*'],
  autoBuild: true,
  pullRequestPreview: true,
};
