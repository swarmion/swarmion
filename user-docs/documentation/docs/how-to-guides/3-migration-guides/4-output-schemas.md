---
sidebar_position: 4
---

# From outputSchema to outputSchemas

## Why?

Before version 0.25.0, in the `ApiGatewayContract`, the `outputSchema` key was used to specify the output schema of an Api Gateway integration.
However, some users reported that they needed multiple output schemas for a single integration to handle different status codes, for error responses for example.
Thus, we decided to add a `outputSchemas` to allow that and remove the `outputSchema` key, which introduced a breaking change.

For more context, check out [the migration PR](https://github.com/swarmion/swarmion/pull/404).

## How?

Migrating from `outputSchema` to `outputSchemas` is quite straightforward:

1. Upgrade serverless-contracts to version 0.25.0 or higher
2. In your contract packages, in the files defining your contracts

   - Add the `HttpStatusCode` type to the imports:

   ```diff
   + import { HttpStatusCode } from '@swarmion/serverless-contracts';
   ```

   - Update the `ApiGatewayContract` to use `outputSchemas` instead of `outputSchema`:

   ```diff
   - outputSchema,
   + outputSchemas: {
   +   [HttpStatusCode.OK]: outputSchema,
   + },
   ```

3. In your backend services handlers defined with the `getHandler` feature, update the return type of your implementation to provide a body and a status code:

```diff
const handler = getHandler(contract)(async (event) => {
    /// your implementation
- return body;
+ return { body, statusCode: HttpStatusCode.OK };
});
```

4. In your services using the consumer features:

   - If you use the `getAxiosRequest` feature, nothing changes
   - If you use the `getFetchRequest` feature, if you want to keep the same behavior as before, you should now access the `body` key of its return value:

   ```diff
   const response = await getFetchRequest(contract, fetch, options);
   - return response;
   + return response.body;
   });
   ```
