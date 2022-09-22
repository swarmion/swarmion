import {
  ApiGatewayContract,
  CloudFormationContract,
  EventBridgeContract,
} from 'contracts';

export type ServerlessContract =
  | ApiGatewayContract
  | CloudFormationContract
  | EventBridgeContract;
