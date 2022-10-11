import * as CloudFormation from 'aws-sdk/clients/cloudformation';
import Aws from 'serverless/plugins/aws/provider/awsProvider';

import { LATEST_DEPLOYED_TIMESTAMP_TAG_NAME } from './constants';

export const getLatestDeployedTimestamp = async (
  provider: Aws,
): Promise<string | undefined> => {
  if (provider.naming.getStackName === undefined) {
    throw new Error('Could not get stack name');
  }
  const stackName = provider.naming.getStackName();

  try {
    const { Stacks } = (await provider.request(
      'CloudFormation',
      'describeStacks',
      {
        StackName: stackName,
      },
    )) as CloudFormation.DescribeStacksOutput;

    return Stacks !== undefined
      ? Stacks[0]?.Tags?.find(
          ({ Key }) => Key === LATEST_DEPLOYED_TIMESTAMP_TAG_NAME,
        )?.Value
      : undefined;
  } catch {
    return undefined;
  }
};
