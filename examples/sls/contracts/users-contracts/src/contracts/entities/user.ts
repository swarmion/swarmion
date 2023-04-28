import { FromSchema } from 'json-schema-to-ts';

export const userEntitySchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    userName: { type: 'string' },
  },
  required: ['userId', 'userName'],
  additionalProperties: false,
} as const;

export type UserEntity = FromSchema<typeof userEntitySchema>;
