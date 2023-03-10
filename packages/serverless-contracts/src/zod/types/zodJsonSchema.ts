import { z } from 'zod';

const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.unknown(),
]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export type ZodJsonSchema = z.ZodType<Json>;

const constrainedZodJsonSchema = z.record(z.union([z.string(), z.unknown()]));
type Constrained = z.infer<typeof constrainedZodJsonSchema>;
export type ConstrainedZodJsonSchema = z.ZodType<Constrained>;
