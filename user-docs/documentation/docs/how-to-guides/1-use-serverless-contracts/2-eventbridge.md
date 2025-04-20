---
sidebar_position: 2
---

# Use EventBridge contracts

In event-driven architectures, events enable interactions between loosely coupled services of an application. In Serverless applications, EventBridge is a stable and sure way to implement asynchronous flows.

Event _emitters_ are responsible for publishing events to events channels.
Event _consumers_ are responsible for executing business logic when a specific event is presented.

An EventBridge contract can be defined between _emitters_ and _consumers_ ensuring the stability of their interaction. It defines common event properties such as the payload schema assuring that events published by _emitters_ trigger the corresponding business logic on the _consumers_' side.

## Defining an EventBridge contract

Let's create our first EventBridge contract. The following arguments are needed:

- the `id` serves to uniquely identify the contract among all stacks.
  Please note that this id MUST be unique among all stacks. Use a convention to ensure uniqueness
- the `eventType` is a string defining the event. It will be mapped to EventBridge's `detail-type` attribute, so make sure it is unique for the contract
- the `payloadSchema` is a JSON schema representing the event payload format. In order to properly use Typescript's type inference it **MUST** be created using the `as const` directive. For more information, see [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#fromschema)
- the `sources` argument defines the **origin** of the event (the _emitter_). Note that it also must be defined with the `as const` directive.

```ts
import { EventBridgeContract } from '@swarmion/serverless-contracts';

const sources = ['custom.source1', 'custom.source2'] as const;

const payloadSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['userId', 'message'],
  additionalProperties: false,
} as const;

export const myEventBridgeContract = new EventBridgeContract({
  id: 'myEventBridgeContract',
  eventType: 'MY_EVENT_TYPE',
  sources,
  payloadSchema,
});
```

## Consumer-side usage

In an AWS serverless application, event _consumers_ would typically be lambda functions.
Here is how to trigger a lambda when an event respecting an EventBridgeEvent Contract has been published.

### Generate the lambda trigger

In the `config.ts` file of our lambda, in the `events` section, we need to use the generated trigger to define the path and method that will trigger the lambda:

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    getTrigger(myEventBridgeContract, {
      eventBus: 'myEventBusName',
    }),
  ],
};
```

Then, the lambda will be triggered when an event with the following pattern is published on the specified bus:

```json
{
  "detail-type": "<myEventBridgeContract.eventType>",
  "source": "<one of myEventBridgeContract.sources>"
}
```

### Generate the lambda handler

With EventBridge contracts, you can generate a natively typed lambda handler with the correct payload format. Simply write:

```ts
import { getHandler } from '@swarmion/serverless-contracts';
import { ajv } from 'libs/ajv';

export const main = getHandler(myEventBridgeContract, { ajv })(async event => {
  const { message, userId } = event.detail; // natively typed with the correct keys

  // write your business logic
});
```

:::info
Regarding the `ajv` option, we advise you to use a singleton instance of ajv that you define in a separate file. This way, you can use the same instance for all your contracts and middlewares.

[See an example](../../how-to-guides/migration-guides/ajv-dependency-injection#share-a-singleton-ajv-instance-across-the-whole-project)
:::

:::caution
This handler also provides a payload validation that will throw an error if there is a mismatch with the `payloadSchema`. This ensure that invalid events will not be mistakenly taken into account. However, be sure to set up an invalid events failure flow, for example with a [Lambda `onFailure` destination](https://www.serverless.com/blog/lambda-destinations/).

If you still wish to disable this behavior, you can use the optional second argument in the `getHandler` feature.
If you do so, you can omit the `ajv` option.

```ts
import { getHandler } from '@swarmion/serverless-contracts';

const handler = getHandler(myContract, {
  validatePayload: false,
})(async event => {
  // ...
});
```

:::

## Provider-side usage

Now that we have generated a type-safe Lambda triggered by our event, Let's see how to put events from the _emitter_.

### Build a typed putEvent function

In order to optimize Lambda cold starts, instantiating the EventBridge sdk must be avoided inside the Lambda handler. This is why we provide a builder function to call outside the Lambda handler. This builder function returns a fully type-safe async function you can call to put the event.

```ts
import { buildPutEvent, getHandler } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { ajvInstance } from 'libs/ajv';

// instantiate the sdk
const eventBridgeClient = new EventBridgeClient({});

//  the event bus name is here available in an env variable, but you can adapt this
//  eventBusName can also be a getter function that is only called before sending the event
const eventBusName = getEnvVariable('EVENT_BUS_NAME');

const putMyCustomEvent = buildPutEvent(myEventBridgeContract, {
  source: 'custom.source1', // or custom.source2 in our example
  eventBridgeClient,
  eventBusName,
});

export const main = getHandler(
  anotherContract,
  ajvInstance,
)(async event => {
  await putMyCustomEvent({ userId: 'toto', message: 'welcome!' });

  // rest of the lambda
});
```

:::caution
This only works with the AWS sdk v3
:::
