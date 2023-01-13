import { Context } from 'aws-lambda';

export const getHandlerContextMock = (args?: Partial<Context>): Context =>
  // @ts-expect-error only partial typing here
  ({
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    ...args,
  });
