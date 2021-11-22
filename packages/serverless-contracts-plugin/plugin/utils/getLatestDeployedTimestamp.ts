import * as AWS from 'aws-sdk';
import Aws from 'serverless/plugins/aws/provider/awsProvider';

import { LATEST_DEPLOYED_TIMESTAMP_TAG_NAME } from './constants';

export const getLatestDeployedTimestamp = async (
  provider: Aws,
): Promise<string | undefined> => {
  const stackName = provider.naming.getStackName();

  const { Stacks } = (await provider.request(
    'CloudFormation',
    'describeStacks',
    {
      StackName: stackName,
    },
  )) as AWS.CloudFormation.DescribeStacksOutput;

  return Stacks !== undefined
    ? Stacks[0].Tags?.find(
        ({ Key }) => Key === LATEST_DEPLOYED_TIMESTAMP_TAG_NAME,
      )?.Value
    : undefined;
};
