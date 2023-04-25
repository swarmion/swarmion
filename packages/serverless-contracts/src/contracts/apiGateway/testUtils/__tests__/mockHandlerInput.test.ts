import { ApiGatewayContract } from '../../apiGatewayContract';
import {
  getMockHandlerInput,
  setMockHandlerInputSeed,
} from '../mockHandlerInput';

describe('apiGateway lambda handler mock input', () => {
  const pathParametersSchema = {
    type: 'object',
    properties: { userId: { type: 'string' }, pageNumber: { type: 'string' } },
    required: ['userId', 'pageNumber'],
    additionalProperties: false,
  } as const;

  const queryStringParametersSchema = {
    type: 'object',
    properties: { testId: { type: 'string' } },
    required: ['testId'],
    additionalProperties: false,
  } as const;

  const headersSchema = {
    type: 'object',
    properties: { myHeader: { type: 'string' } },
    required: ['myHeader'],
  } as const;

  const bodySchema = {
    type: 'object',
    properties: { foo: { enum: ['azer', 'tyui'] }, bar: { type: 'number' } },
    required: ['foo', 'bar'],
  } as const;

  const outputSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
    required: ['id', 'name'],
  } as const;

  const requestContextSchema = {
    type: 'object',
    properties: {
      accountId: { const: '123456789012' },
      authorizer: {
        type: 'object',
        properties: {
          claims: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
          },
        },
        required: ['claims'],
      },
    },
    required: ['accountId', 'authorizer'],
  } as const;

  const httpApiContract = new ApiGatewayContract({
    id: 'testContract',
    path: '/users/{userId}',
    method: 'GET',
    integrationType: 'httpApi',
    authorizerType: 'cognito',
    pathParametersSchema,
    queryStringParametersSchema,
    headersSchema,
    bodySchema,
    outputSchemas: { 200: outputSchema },
    requestContextSchema,
  });

  it('should generate event with random keys for all input variables', () => {
    const [event] = getMockHandlerInput(httpApiContract);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(['azer', 'tyui']).toContainEqual(JSON.parse(event.body ?? '').foo);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(event.body ?? '').bar).toBeTypeOf('number');
    expect(event.pathParameters?.userId).toBeTypeOf('string');
    expect(event.queryStringParameters?.testId).toBeTypeOf('string');
    expect(event.headers.myHeader).toBeTypeOf('string');
    expect(event.requestContext.accountId).toEqual('123456789012');
    expect(event.requestContext.authorizer.claims.foo).toBeTypeOf('string');
  });

  it('should generete event with some defined keys', () => {
    const [event] = getMockHandlerInput(httpApiContract, {
      body: { foo: 'azer', bar: 123 },
      requestContext: {
        authorizer: {
          claims: {
            foo: 'fakeClaim',
          },
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(event.body ?? '').foo).toEqual('azer');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(event.body ?? '').bar).toEqual(123);
    expect(event.pathParameters?.userId).toBeTypeOf('string');
    expect(event.queryStringParameters?.testId).toBeTypeOf('string');
    expect(event.headers.myHeader).toBeTypeOf('string');
    expect(event.requestContext.accountId).toEqual('123456789012');
    expect(event.requestContext.authorizer.claims.foo).toEqual('fakeClaim');
  });

  it('should generate the same data with the same seed', () => {
    const [event1] = getMockHandlerInput(httpApiContract);
    const [event2] = getMockHandlerInput(httpApiContract);

    setMockHandlerInputSeed('newSeed');

    const [event3] = getMockHandlerInput(httpApiContract);
    const [event4] = getMockHandlerInput(httpApiContract);

    expect(event1).toEqual(event2);
    expect(event3).toEqual(event4);
    expect(event1).not.toEqual(event3);
  });
});
