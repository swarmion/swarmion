import { AWS } from '@serverless/typescript';

import { Unpacked } from './utilities';

/**
 * From @serverless/typescript, we get the type of a single lambda config
 */
export type LambdaFunction = Exclude<AWS['functions'], undefined>[string];

/**
 * Narrowing the type of a lambda config to the type of its events
 */
export type LambdaEvents = Unpacked<LambdaFunction['events']>;
