---
sidebar_position: 3
---

# Using Event contracts

In event-driven architectures, events enable interactions between loosely coupled services of an application.

Event emitters are responsible for publishing events to events channels.
Event consumers are responsible for executing business logic when a specific event is presented.

An Event contract can be defined between emitters and consumers ensuring the stability of their interaction. It defines a common Event payload schema assuring that events published by emitters trigger the corresponding business logic on the consumers' side.

## Defining an Event contract

Let's create our first Event contract. Only two arguments are needed:

- the `id` serves to uniquely identify the contract among all stacks.
  Please note that this id MUST be unique among all stacks. Use a convention to ensure uniqueness.
- the `payloadSchema` which is a JSON schema

```ts
import { EventContract } from '@swarmion/serverless-contracts';

const payloadSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  required: ['name'],
  additionalProperties: false,
} as const;

const myEventContract = new EventContract({
  id: 'my-event-contract',
  payloadSchema,
});
```

In order to properly use Typescript's type inference all the schemas **MUST** be created using the `as const` directive. For more information, see [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#fromschema)

## Defining an EventBridgeEvent contract

Event channels in the AWS serverless stack are typically an EventBridge bus, an SNS topic or an SQS queue.

Let's focus on EventBridge buses.

When interactions between emitters and consumers occur on an EventBridge bus, additional information specific to AWS EventBridge must be added to the Event contract (a bus name, an event source).
This additional information, along with an Event contract, defines an **EventBridgeEvent Contract**.

Here is how to define our first EventBridgeEvent contract using our previously defined Event contract:

```ts
import { EventBridgeEventContract } from '@swarmion/serverless-contracts';

import { myEventContract } from './myEventContract';

const myEventBridgeEventContract = new EventBridgeEventContract(eventContract, {
  name: 'my-eventBridgeEvent-contract',
  busName: 'my-eventBus-name',
  source: 'my-eventSource',
});
```

## Provider-side usage

Coming soon!

## Consumer-side usage

In an AWS serverless stack, event consumers would typically be lambda functions.
Here is how to trigger a lambda when an event respecting an EventBridgeEvent Contract has been published.

### Generate the lambda trigger

In the `config.ts` file of our lambda, in the `events` section, we need to use the generated trigger to define the path and method that will trigger the lambda:

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    getEventBridgeLambdaTrigger(myEventBridgeEventContract, {
      'Fn::GetAtt': ['EventBridge', 'Name'], // to find the correct eventbus name
    }),
  ],
};
```

Then, the lambda will be triggered when an event with the following pattern is published on the specified bus:

```ts
{
  "detail-type": [
    eventBridgeEventContract.name
  ],
  "source": [
   eventBridgeEventContract.source
  ]
}
```
