import { JSONSchema } from 'json-schema-to-ts';

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
  provides: Record<string, JSONSchema>;
  consumes: Record<string, JSONSchema>;
};

export interface RemoteServerlessContracts extends ServerlessContracts {
  gitCommit: string;
  contractsVersion: '1.0.0';
}
