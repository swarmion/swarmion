import { AwsArn } from '@serverless/typescript';

import { EventBridgeContract } from '../eventBridgeContract';

export type EventBridgeLambdaTrigger<Contract extends EventBridgeContract> = {
  eventBridge: {
    pattern: {
      source: Contract['sources'];
      'detail-type': [Contract['eventType']];
    };
    eventBus: string;
  };
};

/**
 * the EventBridge arguments other than the contract itself.
 *
 * The @serverless/typescript is not precise on this
 *
 * See https://www.serverless.com/framework/docs/providers/aws/events/event-bridge
 */
export type EventBridgeTriggerArgs = {
  eventBus: string;
  deadLetterQueueArn?: AwsArn;
  retryPolicy?: {
    maximumEventAge?: number;
    maximumRetryAttempts?: number;
  };
  [key: string]: unknown;
};
