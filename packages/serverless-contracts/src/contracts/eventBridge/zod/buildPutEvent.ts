import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

import { EventBridgeContract } from './EventBridgeContract';
import { EventBridgePayloadType } from './EventBridgePayloadType';

export type PutEventBuilderArgs<Contract extends EventBridgeContract> = {
  eventBusName: string;
  source: Contract['sources'][number];
  eventBridgeClient: EventBridgeClient;
};

export type PutEventSideEffect<Contract extends EventBridgeContract> = (
  payload: EventBridgePayloadType<Contract>,
) => Promise<void>;

export type PutEventsSideEffect<Contract extends EventBridgeContract> = (
  payloads: EventBridgePayloadType<Contract>[],
) => Promise<void>;

export const buildPutEvent =
  <Contract extends EventBridgeContract>(
    contract: Contract,
    params: PutEventBuilderArgs<Contract>,
  ): PutEventSideEffect<Contract> =>
  async payload =>
    buildPutEvents(contract, params)([payload]);

export const buildPutEvents =
  <Contract extends EventBridgeContract>(
    contract: Contract,
    { eventBusName, source, eventBridgeClient }: PutEventBuilderArgs<Contract>,
  ): PutEventsSideEffect<Contract> =>
  async payloads => {
    const events = payloads.map(payload => ({
      Detail: JSON.stringify(payload),
      DetailType: contract.eventType,
      Source: source,
      EventBusName: eventBusName,
    }));

    const command = new PutEventsCommand({
      Entries: events,
    });

    await eventBridgeClient.send(command);
  };
