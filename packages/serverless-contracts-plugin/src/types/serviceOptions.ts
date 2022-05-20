import { JSONSchema } from 'json-schema-to-ts';

import { ServerlessContract } from '@swarmion/serverless-contracts';

export const serviceOptionsSchema = {
  type: 'object',
  properties: {
    provides: {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9]{1,255}$': {
          type: 'object',
          properties: {},
        },
      },
    },
    consumes: {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9]{1,255}$': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
  required: ['provides', 'consumes'],
} as const;

export type ServiceOptions = {
  contracts: ServerlessContracts;
};

export type ServerlessContracts = {
  provides: Record<string, ServerlessContract>;
  consumes: Record<string, ServerlessContract>;
};

export interface ServerlessContractSchemas {
  provides: Record<string, JSONSchema>;
  consumes: Record<string, JSONSchema>;
}

export interface RemoteServerlessContractSchemas
  extends ServerlessContractSchemas {
  gitCommit: string;
  contractsVersion: '1.0.0';
}
