import { Handler } from 'aws-lambda';

import { SwarmionRouter } from './router';

export const handle = (
  router: SwarmionRouter,
  options?: { logger?: boolean },
): Handler => {
  return async (event, ...otherArgs) => {
    if (options?.logger === true) {
      console.log('event', event);
    }

    const matchedRoute = router.match(event);

    if (matchedRoute === null) {
      return Promise.resolve({
        statusCode: 404,
        body: 'Not found',
      });
    }

    const [handler, newEvent] = matchedRoute;

    return handler(newEvent, ...otherArgs);
  };
};
