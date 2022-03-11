import { FromSchema } from 'json-schema-to-ts';

export const postEntitySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    authorId: { type: 'string' },
    createdAt: { type: 'string' },
    editedAt: { type: ['string', 'null'] },
  },
  required: ['id', 'content', 'authorId', 'createdAt', 'editedAt'],
  additionalProperties: false,
} as const;

export type PostEntity = FromSchema<typeof postEntitySchema>;
