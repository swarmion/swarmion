import { AWS } from '@serverless/typescript';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FromSchema } from 'json-schema-to-ts';
import Service from 'serverless/classes/Service';

export const cdkPluginConfigSchema = {
  type: 'object',
  properties: {
    stack: { type: 'object' },
    stackName: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export type CdkPluginConfigType = FromSchema<typeof cdkPluginConfigSchema>;

export type ServerlessCdkPluginConfig = {
  custom: {
    cdkPlugin: Omit<CdkPluginConfigType, 'stack'> & {
      stack: typeof ServerlessStack | typeof Stack;
    };
  };
};

export type ServerlessConfigFile = AWS & ServerlessCdkPluginConfig;

export interface ServerlessProps {
  config: ServerlessConfigFile;
  service: Service;
}

export class ServerlessStack extends Stack {
  serverlessProps?: ServerlessProps;

  constructor(scope: Construct, id: string, serverlessProps?: ServerlessProps) {
    super(scope, id);

    this.serverlessProps = serverlessProps;
  }
}
