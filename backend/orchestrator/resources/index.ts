// import { AWS } from '@serverless/typescript';
// import { App } from 'aws-cdk-lib';

// import { OrchestratorStack } from './stack';

// type CloudFormationTemplate = Exclude<AWS['resources'], undefined>;

// export const cdkApp = new App();

// export const cdkStack = new OrchestratorStack(
//   cdkApp,
//   'SwarmionOrchestratorStack',
// );

// const { Resources, Outputs, Conditions } = cdkApp
//   .synth()
//   .getStackByName(cdkStack.stackName).template as CloudFormationTemplate;

// export const cdkResources = {
//   Resources,
//   Outputs,
//   Conditions,
// };
