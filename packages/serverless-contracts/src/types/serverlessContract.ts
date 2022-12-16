import {
  CloudFormationContract,
  EventBridgeContract,
  GenericApiGatewayContract,
} from 'contracts';

export type ServerlessContract =
  | GenericApiGatewayContract
  | CloudFormationContract
  | EventBridgeContract;
