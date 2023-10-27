import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

// move this contract to a shared library once you need to use it outside this service
export const healthContract = new ApiGatewayContract({
  id: 'core-health',
  path: '/health',
  method: 'GET',
  integrationType: 'restApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
      additionalProperties: false,
    } as const,
  },
});
