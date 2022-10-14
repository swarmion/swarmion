process.env.ORCHESTRATOR_TABLE_NAME = 'orchestrator-table-name';

import { getAPIGatewayEventHandlerContextMock } from '@swarmion/serverless-helpers';

import ServiceEventEntity from 'libs/dynamodb/models/serviceEvent';

import { main } from '../handler';

vi.mock('libs/dynamodb/models/serviceEvent');

const eventMock = {
  body: JSON.stringify({
    serviceId: 'serviceId',
    applicationId: 'applicationId',
  }),
} as Parameters<typeof main>[0];

describe('requestSyncDeployment handler', () => {
  it('should put a service event entity inside the orchestrator table', async () => {
    const response = await main(
      eventMock,
      getAPIGatewayEventHandlerContextMock(),
      () => null,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(ServiceEventEntity.put).toHaveBeenCalledWith({
      serviceId: 'serviceId',
      applicationId: 'applicationId',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      eventId: expect.any(String),
    });

    expect(response).toStrictEqual({
      body: '{"status":"ACCEPTED","message":"processing"}',
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    });
  });
});
