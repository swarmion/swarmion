import { FromSchema } from 'json-schema-to-ts';

export const threadEntitySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    createdAt: { type: 'string' },
    editedAt: { type: ['string', 'null'] },
  },
  required: ['id', 'name', 'createdAt', 'editedAt'],
  additionalProperties: false,
} as const;

export type ThreadEntity = FromSchema<typeof threadEntitySchema>;
