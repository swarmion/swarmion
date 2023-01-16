---
sidebar_position: 2
---

# Services

Services are modules meant to be **deployed** and serve the application logic, provision the resources, etc. They can either be backend services or frontend services.

Although Swarmion mainly uses the [Serverless Framework](https://www.serverless.com/) to deploy its services, it is also possible to use other deployment providers.

## Service structure

A typical Swarmion service has the following structure:

```
├── my-service/
|   ├── ...
|   ├── package.json            # dependencies of this service
|   ├── serverless.ts           # serverless service file
|   └── tsconfig.json           # typescript config
```

## Generate a Service

You can generate a new service respecting these guidelines using the [@swarmion/nx-plugin](../../how-to-guides/use-swarmion-generators)
