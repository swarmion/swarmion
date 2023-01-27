import {
  getAPIGatewayEventHandlerContextMock,
  getAPIGatewayV2EventRequestContextMock,
} from '@swarmion/serverless-helpers';

import { main } from './handler';

const generateUlid = () => 'ulid';

describe('requestSyncDeployment handler', () => {
  it('should put a service event entity inside the orchestrator table', async () => {
    const mockStoreServiceEvent = vitest.fn(() => Promise.resolve());
    const mockPutRequestedContractEvent = vitest.fn(() => Promise.resolve());

    const response = await main(
      {
        body: JSON.stringify({
          serviceId: 'serviceId',
          applicationId: 'applicationId',
        }),
        version: '',
        routeKey: '',
        rawPath: '',
        rawQueryString: '',
        headers: {},
        requestContext: getAPIGatewayV2EventRequestContextMock(),
        isBase64Encoded: false,
      },
      getAPIGatewayEventHandlerContextMock(),
      () => null,
      {
        storeServiceEvent: mockStoreServiceEvent,
        putRequestedContractEvent: mockPutRequestedContractEvent,
        generateUlid,
      },
    );

    expect(mockStoreServiceEvent).toHaveBeenCalledWith({
      serviceId: 'serviceId',
      applicationId: 'applicationId',
      eventId: 'ulid',
    });

    expect(mockPutRequestedContractEvent).toHaveBeenCalledWith({
      serviceId: 'serviceId',
      applicationId: 'applicationId',
      eventId: 'ulid',
    });

    expect(response).toStrictEqual({
      body: '{"status":"ACCEPTED","message":"processing"}',
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    });
  });
});
