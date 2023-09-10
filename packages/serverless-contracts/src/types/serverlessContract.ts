import {
  CloudFormationContract,
  EventBridgeContract,
  GenericApiGatewayContract,
  SQSContract,
} from 'contracts';

export type ServerlessContract =
  | GenericApiGatewayContract
  | CloudFormationContract
  | EventBridgeContract
  | SQSContract;
