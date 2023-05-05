import { Callback, Context } from 'aws-lambda';
import { A } from 'ts-toolbelt';

import { typeAssert } from 'utils';

import { httpApiGatewayContractMock } from '../../__mocks__/httpApiGatewayContract';
import { ApiGatewayEvent } from '../../types';
import { getMockHandlerInput } from '../mockHandlerInput';

const [event, context, callback] = getMockHandlerInput(
  httpApiGatewayContractMock,
);

typeAssert<A.Extends<typeof event, ApiGatewayEvent<'httpApi', 'cognito'>>>();

typeAssert<A.Extends<typeof context, Context>>();

typeAssert<A.Extends<typeof callback, Callback>>();
