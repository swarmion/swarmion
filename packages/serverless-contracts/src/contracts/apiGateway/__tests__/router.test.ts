import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda';
import merge from 'lodash/merge.js';

import {
  getAPIGatewayEventRequestContextMock,
  getAPIGatewayV2EventRequestContextMock,
} from '@swarmion/serverless-helpers';

import { ApiGatewayContract } from '../apiGatewayContract';
import {
  isValidHttpApiGatewayEvent,
  isValidRestApiGatewayEvent,
  matchApiGatewayContract,
  SwarmionRouter,
} from '../features';

describe('SwarmionRouter', () => {
  let router: SwarmionRouter;
  const httpApiContract = new ApiGatewayContract({
    id: 'contract',
    path: '/contract/{id}',
    method: 'GET',
    integrationType: 'httpApi',
  });
  const restApiContract = new ApiGatewayContract({
    id: 'contract',
    path: '/contract/{id}',
    method: 'GET',
    integrationType: 'restApi',
  });

  beforeEach(() => {
    router = new SwarmionRouter();
  });

  describe('isValidRestApiGatewayEvent', () => {
    it('should return true for a valid restApi event', () => {
      const event = { requestContext: { httpMethod: 'GET' } };

      const result = isValidRestApiGatewayEvent(event);

      expect(result).toBe(true);
    });

    it('should return false for an invalid restApi event', () => {
      const event = { source: 'source' };

      const result = isValidRestApiGatewayEvent(event);

      expect(result).toBe(false);
    });
  });

  describe('isValidHttpApiGatewayEvent', () => {
    it('should return true for a valid httpApi event', () => {
      const event = { requestContext: { http: { method: 'GET' } } };
      const result = isValidHttpApiGatewayEvent(event);
      expect(result).toBe(true);
    });

    it('should return false for an invalid httpApi event', () => {
      const event = {
        source: 'source',
      };
      const result = isValidHttpApiGatewayEvent(event);
      expect(result).toBe(false);
    });
  });

  describe('matchApiGatewayContract', () => {
    describe('httpApi', () => {
      it('should return the enriched event if it matches the contract', () => {
        const event = {
          requestContext: merge(getAPIGatewayV2EventRequestContextMock(), {
            http: { method: 'GET' },
          }),
          rawPath: '/contract/contractId',
        } satisfies Partial<APIGatewayProxyEventV2>;

        const result = matchApiGatewayContract(httpApiContract, event);

        expect(result).toEqual({
          ...event,
          pathParameters: { id: 'contractId' },
        });
      });

      it('should return false if the path does not match the contract', () => {
        const event = {
          requestContext: merge(getAPIGatewayV2EventRequestContextMock(), {
            http: { method: 'GET' },
          }),
          rawPath: '/otherPath',
        };

        const result = matchApiGatewayContract(httpApiContract, event);

        expect(result).toBe(false);
      });

      it('should return false if the method does not match the contract', () => {
        const event = {
          requestContext: merge(getAPIGatewayV2EventRequestContextMock(), {
            http: { method: 'POST' },
          }),
          rawPath: '/contract',
        } satisfies Partial<APIGatewayProxyEventV2>;

        const result = matchApiGatewayContract(httpApiContract, event);

        expect(result).toBe(false);
      });
    });
    describe('restApi', () => {
      it('should return the event if it matches the contract', () => {
        const event = {
          requestContext: getAPIGatewayEventRequestContextMock({
            httpMethod: 'GET',
          }),
          path: '/contract/contractId',
        } satisfies Partial<APIGatewayProxyEvent>;

        const result = matchApiGatewayContract(restApiContract, event);

        expect(result).toEqual({
          ...event,
          pathParameters: { id: 'contractId' },
        });
      });

      it('should return false if the path does not match the contract', () => {
        const event = {
          requestContext: getAPIGatewayEventRequestContextMock({
            httpMethod: 'GET',
          }),
          path: '/otherPath',
        } satisfies Partial<APIGatewayProxyEvent>;

        const result = matchApiGatewayContract(restApiContract, event);

        expect(result).toBe(false);
      });

      it('should return false if the method does not match the contract', () => {
        const event = {
          requestContext: getAPIGatewayEventRequestContextMock({
            httpMethod: 'POST',
          }),
          path: '/contract',
        } satisfies Partial<APIGatewayProxyEvent>;

        const result = matchApiGatewayContract(restApiContract, event);

        expect(result).toBe(false);
      });
    });
  });

  describe('add', () => {
    it('should add a restApi consumer', () => {
      const handler = vi.fn();

      router.add(restApiContract)(handler);

      expect(router['consumers']).toHaveLength(1);
      expect(router['consumers'][0]?.[0]).toBe(restApiContract);
    });

    it('should add an httpApi consumer', () => {
      const handler = vi.fn();

      router.add(httpApiContract)(handler);

      expect(router['consumers']).toHaveLength(1);
      expect(router['consumers'][0]?.[0]).toBe(httpApiContract);
    });

    it('should add multiple consumer', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      router.add(httpApiContract)(handler1);
      router.add(restApiContract)(handler2);

      expect(router['consumers']).toHaveLength(2);
    });
  });

  describe('match', () => {
    it('should match an restApi contract', () => {
      const event = {
        requestContext: getAPIGatewayEventRequestContextMock({
          httpMethod: 'GET',
        }),
        path: '/contract/contractId',
      } satisfies Partial<APIGatewayProxyEvent>;

      const handler = vi.fn();

      router.add(restApiContract)(handler);
      const result = router.match(event);

      expect(result?.[1]).toEqual({
        ...event,
        pathParameters: { id: 'contractId' },
      });
    });
    it('should match a httpApi contract', () => {
      const event = {
        requestContext: merge(getAPIGatewayV2EventRequestContextMock(), {
          http: { method: 'GET' },
        }),
        rawPath: '/contract/contractId',
      } satisfies Partial<APIGatewayProxyEventV2>;

      const handler = vi.fn();

      router.add(httpApiContract)(handler);
      const result = router.match(event);

      expect(result?.[1]).toEqual({
        ...event,
        pathParameters: { id: 'contractId' },
      });
    });

    it('should return null for an invalid event', () => {
      const event = {};

      const result = router.match(event);

      expect(result).toBeNull();
    });
  });
});
