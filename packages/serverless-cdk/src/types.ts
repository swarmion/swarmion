import { AWS as AWSServerlessConfiguration } from '@serverless/typescript';
import { Construct } from 'constructs';

export type AWS = AWSServerlessConfiguration & {
  serverlessCdkBridge: typeof Construct;
};
