import { PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventBridgeContract } from '../eventBridgeContract';
import { PutEventBuilderArgs, PutEventSideEffect } from '../types/putEvent';

export const buildPutEvent =
  <Contract extends EventBridgeContract>(
    contract: Contract,
    {
      eventBusName,
      source,
      eventBridgeClient,
      throwOnFailure = true,
    }: PutEventBuilderArgs<Contract>,
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

    const { FailedEntryCount, Entries } = await eventBridgeClient.send(command);

    if ((FailedEntryCount ?? 0) > 0 && throwOnFailure) {
      const failedEntry = Entries?.[0];
      console.error(
        `Failed to send this event: ${JSON.stringify(event, null, 2)}`,
      );
      throw new Error(
        `Failed to send event. Error: ${failedEntry?.ErrorMessage} (${failedEntry?.ErrorCode})`,
      );
    }

    return { failedEntryCount: FailedEntryCount, entry: Entries?.[0] };
  };
