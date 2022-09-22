import { ApiGatewayContract, EventBridgeContract } from 'contracts';
import {
  ApiGatewayLambdaCompleteTriggerType,
  ApiGatewayTriggerArgs,
} from 'contracts/apiGateway/types';
import {
  EventBridgeLambdaTrigger,
  EventBridgeTriggerArgs,
} from 'contracts/eventBridge/types';

import { ServerlessContract } from './serverlessContract';

export type GetTriggerArgs<Contract extends ServerlessContract> =
  Contract extends ApiGatewayContract
    ? ApiGatewayTriggerArgs<Contract>
    : Contract extends EventBridgeContract
    ? EventBridgeTriggerArgs<Contract>
    : [Contract, never];

export type GetTriggerReturn<Contract extends ServerlessContract> =
  Contract extends ApiGatewayContract
    ? ApiGatewayLambdaCompleteTriggerType<Contract>
    : Contract extends EventBridgeContract
    ? EventBridgeLambdaTrigger<Contract>
    : never;
