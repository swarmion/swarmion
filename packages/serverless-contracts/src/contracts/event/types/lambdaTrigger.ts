import { AWS } from '@serverless/typescript';

export type LambdaFunction = Exclude<AWS['functions'], undefined>[string];

/**
 * extract a type from an array of types.
 * See https://stackoverflow.com/questions/43537520/how-do-i-extract-a-type-from-an-array-in-typescript/52331580
 *
 **/
type Unpacked<T> = T extends (infer U)[] ? U : T;

type LambdaEvents = Unpacked<LambdaFunction['events']>;

/**
 * represent the lambda config type without path and method
 */
export type EventBridgeLambdaCompleteTriggerType = Extract<
  LambdaEvents,
  Record<'eventBridge', unknown>
>;
