import { PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventBridgeContract } from '../eventBridgeContract';
import { PutEventBuilderArgs, PutEventSideEffect } from '../types/putEvent';

export const buildPutEvent =
  <Contract extends EventBridgeContract>(
    contract: Contract,
    { eventBusName, source, eventBridgeClient }: PutEventBuilderArgs<Contract>,
  ): PutEventSideEffect<Contract> =>
  async payload => {
    const event = {
      Detail: JSON.stringify(payload),
      DetailType: contract.eventType,
      Source: source,
      EventBusName:
        typeof eventBusName === 'string' ? eventBusName : await eventBusName(),
    };

    const command = new PutEventsCommand({
      Entries: [event],
    });

    await eventBridgeClient.send(command);
  };
