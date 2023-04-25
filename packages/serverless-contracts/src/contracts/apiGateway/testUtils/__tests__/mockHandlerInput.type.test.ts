import { Callback, Context } from 'aws-lambda';

import { httpApiGatewayContractMock } from '../../__mocks__/httpApiGatewayContract';
import { ApiGatewayEvent } from '../../types';
import { getMockHandlerInput } from '../mockHandlerInput';

const [event, context, callback] = getMockHandlerInput(
  httpApiGatewayContractMock,
);

type EventCheck = typeof event extends ApiGatewayEvent<'httpApi', 'cognito'>
  ? 'pass'
  : 'fail';

const eventCheck: EventCheck = 'pass';
eventCheck;

type ContextCheck = typeof context extends Context ? 'pass' : 'fail';

const contextCheck: ContextCheck = 'pass';
contextCheck;

type CallbackCheck = typeof callback extends Callback ? 'pass' : 'fail';

const callbackCheck: CallbackCheck = 'pass';
callbackCheck;
