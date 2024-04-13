---
sidebar_position: 2
---

# Use SQS contracts

Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications.

_Emitters_ publishes messages into a **Queue**.
_Consumers_ polls batch of messages from the queue to process them.

An SQS contract can be defined between _emitters_ and _consumers_ ensuring the stability of their interaction.
It defines common message properties such as the body schema assuring that messages published by _emitters_ can be handled by _consumers_'.

## Defining an SQS contract

Let's create our first SQS contract. The following arguments are needed:

- the `id` serves to uniquely identify the contract among all stacks.
  Please note that this id MUST be unique among all stacks. Use a convention to ensure uniqueness
- the `messageBodySchema` is a JSON schema representing the message body format. In order to properly use Typescript's type inference, it **MUST** be created using the `as const` directive. For more information, see [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts#fromschema)
- the `messageAttributesSchema` is an _optional_ JSON schema representing the message attributes format.

```ts
import { SQSContract } from '@swarmion/serverless-contracts';
import { JSONSchema } from 'json-schema-to-ts';

export const messageBodySchema = {
  type: 'object',
  properties: {
    toto: { type: 'string' },
  },
  required: ['toto'],
  additionalProperties: false,
} as const satisfies JSONSchema;

export const mySqsContract = new SQSContract({
  id: 'mySQSContract',
  messageBodySchema,
});
```

## Consumer-side usage

In an AWS serverless application, messages _consumers_ would typically be lambda functions.
Here is how to trigger a lambda when an event respecting an EventBridgeEvent Contract has been published.

### Generate the lambda trigger

The SQS contract is not needed to define the trigger of the consumer.
It only depends on the SQS ARN, which is not in the contract.

However, you must set [the function response type to `ReportBatchItemFailures`](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html#services-sqs-batchfailurereporting) to be compatible with the default behavior of the Swarmion handler defined in the next part.

With serverless framework, the function definition should be like:

```ts
export default {
  environment: {},
  handler: getHandlerPath(__dirname),
  events: [
    {
      sqs: {
        arn: 'myQueueArn',
        functionResponseType: 'ReportBatchItemFailures',
      },
    },
  ],
};
```

With CDK, the function definition should be like:

```ts
const myLambda = new NodejsFunction(this, 'myLambda', {
  entry: path.join(__dirname, 'handler.ts'),
  handler: 'main',
});
myLambda.addEventSource(
  new SqsEventSource(myQueue, {
    reportBatchItemFailures: true,
  }),
);
```

The lambda will be triggered with a batch of up to 10 messages when messages are available in the queue.

### Generate the lambda handler

With SQS contracts, you can generate a natively typed lambda handler which

- **validates** the messages against the contract to unsure the message body and message attributes format
- **parse** the message body and message attributes to handle proper js objects.
- abstract the iteration on the **batched messages**
- abstract the return of **failed messages** to SQS

Simply write:

```ts
import { getHandler } from '@swarmion/serverless-contracts';
import { ajv } from 'libs/ajv';

export const main = getHandler(mySqsContract, { ajv })(async message => {
  const { toto } = message.body; // parsed and typed with the correct keys

  // write your business logic for one message
});
```

:::info
If one of the message handlers fails,
**the global handler will catch the error** and return the id of the failed messages to SQS.
The return of the handler will be like:

```json
{
  "batchItemFailures": [
    {
      "itemIdentifier": "messageId"
    }
  ]
}
```

:::

:::info
The default body parser is `JSON.parse`. You can provide your own body parser with the `bodyParser` option.
Use explicit `undefined` to disable body parsing.

```ts
import { getHandler } from '@swarmion/serverless-contracts';

const handler = getHandler(myContract, {
  ajv,
  bodyParser: undefined,
})(async message => {
  const { body } = message; // body is a raw string
  // ...
});
```

:::

:::info
Regarding the `ajv` option, we advise you to use a singleton instance of ajv that you define in a separate file. This way, you can use the same instance for all your contracts and middlewares.

[See an example](../../how-to-guides/migration-guides/ajv-dependency-injection#share-a-singleton-ajv-instance-across-the-whole-project)
:::

:::caution
This handler also provides a body validation
that will throw an error if there is a mismatch with the `messageBodySchema`.
This ensures that invalid messages will not be mistakenly taken into account.
However, be sure to set up an invalid message failure flow,
for example, with a [DLQ](https://www.serverless.com/blog/lambda-destinations/).

If you still wish to disable this behavior, you can use the optional second argument in the `getHandler` feature.
If you do so, you can omit the `ajv` option.

```ts
import { getHandler } from '@swarmion/serverless-contracts';

const handler = getHandler(myContract, {
  validateBody: false,
})(async message => {
  // ...
});
```

:::

Alternatively, if you wish to handle the batch behavior by yourself, you can set the `handleBatchedRecords` option to `false`.

```ts
import { getHandler } from '@swarmion/serverless-contracts';
import { ajv } from 'libs/ajv';

export const main = getHandler(mySqsContract, {
  ajv,
  handleBatchedRecords: false,
})(async ({ records }) => {
  records.forEach(message => {
    const { toto } = message.body; // parsed and typed with the correct keys

    // write your business logic for one message
  });
  // Handle message failure as you want.
  // Be aware that unhandled failure will make the whole batch of messages available after the visibility timeout,
  // even the processed one.
});
```

## Emitter-side usage

Now that we have generated a type-safe Lambda triggered by our messages, let's see how to publish messages from the _emitter_.

### Build a typed sendMessage function

The builder function `buildSendMessage` returns a fully type-safe async function you can call to send a message.

In order to optimize Lambda cold starts, instantiating the SQS sdk must be avoided inside the Lambda handler. This is why we provide a builder function to call outside the Lambda handler.

```ts
import { buildSendMessage, getHandler } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';
import { SQSClient } from '@aws-sdk/client-sqs';
import { ajv } from 'libs/ajv';

// Instantiate the sdk
const sqsClient = new SQSClient({});

// The queue url is here available in an env variable, but you can adapt this
const queueUrl = getEnvVariable('QUEUE_URL');

const sendMyMessage = buildSendMessage(mySqsContract, {
  queueUrl,
  sqsClient,
  ajv,
});

export const main = getHandler(anotherContract, { ajv })(async event => {
  await sendMyMessage({ body: { toto: 'totoValue' } }); // Typesafe

  // rest of the lambda
});
```

:::info
The default body serializer is `JSON.serialize`. You can provide your own body serializer with the `bodySerializer` option.
Use explicit `undefined` to disable body serialization.

```ts
const sendMyMessage = buildSendMessage(mySqsContract, {
  queueUrl,
  sqsClient,
  ajv,
  bodySerializer: undefined,
});

await sendMyMessage({ body: 'toto' });
```

:::

:::info
Regarding the `ajv` option, we advise you to use a singleton instance of ajv that you define in a separate file. This way, you can use the same instance for all your contracts and middlewares.

[See an example](../../how-to-guides/migration-guides/ajv-dependency-injection#share-a-singleton-ajv-instance-across-the-whole-project)
:::

:::caution
The message sender also provides a body validation
that will throw an error if there is a mismatch with the `messageBodySchema`.
This ensures that invalid messages will not be mistakenly sent.

If you still wish to disable this behavior, you can use the optional `validateMessage` argument in the `buildSendMessage` feature.
If you do so, you can omit the `ajv` option.

```ts
const sendMyMessage = buildSendMessage(mySqsContract, {
  queueUrl,
  sqsClient,
  validateMessage: false,
});

await sendMyMessage({ body: { what: 'ever' } });
```

:::

:::caution
This only works with the AWS SDK v3
:::

### Build a typed sendMessages function

The builder function `buildSendMessages` returns a fully type-safe async function you can call to send a list of messages
to the SQS queue without bothering with the batching process or retry policy in case of throttling.

```ts
import { buildSendMessages, getHandler } from '@swarmion/serverless-contracts';
import { getEnvVariable } from '@swarmion/serverless-helpers';
import { SQSClient } from '@aws-sdk/client-sqs';
import { ajv } from 'libs/ajv';

// Instantiate the sdk
const sqsClient = new SQSClient({});

// The queue url is here available in an env variable, but you can adapt this
const queueUrl = getEnvVariable('QUEUE_URL');

const sendMyMessages = buildSendMessages(mySqsContract, {
  queueUrl,
  sqsClient,
  ajv,
});

export const main = getHandler(anotherContract, { ajv })(async event => {
  await sendMyMessages([
    { body: { toto: 'totoValue1' } }, // Typesafe
    { body: { toto: 'totoValue2' } },
    { body: { toto: 'totoValue3' } },
    { body: { toto: 'totoValue4' } },
    { body: { toto: 'totoValue5' } },
  ]);

  // rest of the lambda
});
```

:::info
It supports the same options as `buildSendMessage` plus `throughputCallsPerSecond`, `maxRetries`,
`baseDelay` to configure the SQS API calls rate and the behavior in case of SendMessageBatchCommand throttling.
:::

:::info
The default behavior is
to send all commands in parallel
because [standard queues have no throughput limitation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html).

But FIFO queues have a throughput limitation of 300 API calls per second.
Set the `throughputCallsPerSecond` option to `300` for FIFO queues.

[FIFO queues with High Throughput](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/high-throughput-fifo.html) have a higher limit
that depends on the AWS region,
see [the quota page](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html)
to know what `throughputCallsPerSecond` to set.
:::

:::caution
If the `maxRetries` is reached, the message sender will throw by default. You can set the `throwOnFailedBatch` option to `false` to return the failed items instead
:::

## Use message attributes

The contract and all its utils also support [SQS message attributes](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-java-send-message-with-attributes.html).
If you define a `messageAttributesSchema` in the contract,
the message attributes from the incoming messages will be parsed and validated,
the message attributes of messages to be sent will be validated and serialized.

:::info
[Message attributes format in SQS messages](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_MessageAttributeValue.html) is very specific.

For example, for a string attribute,
the SQS message will contain the following `MessagesAttributes` object:

```json
{
  "attributeName": {
    "DataType": "String",
    "StringValue": "attributeValue"
  }
}
```

The parsing function parses it into:

```json
{
  "attributeName": "attributeValue"
}
```

and the serialization does the opposite based on the json schema provided.
:::

:::caution

Only string and number data types are currently supported for serialization.

:::
