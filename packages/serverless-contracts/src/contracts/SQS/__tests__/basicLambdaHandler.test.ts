import Ajv from 'ajv';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { getHandler } from 'features/lambdaHandler';

import { baseRecord, minimalSqsContract, sqsContract } from './mock';

const ajv = new Ajv({ keywords: ['faker'] });

describe('SQSContract basic handler test', () => {
  const fakeContext = getHandlerContextMock();

  it('should handle the records', async () => {
    const handler = getHandler(sqsContract, {
      ajv,
      handleBatchedRecords: false,
    })(async event => {
      await Promise.resolve();

      return event.records.map(record => ({
        bodyToto: record.body.toto,
        messageAttributesTata: record.messageAttributes.tata,
      }));
    });

    const result = await handler(
      {
        Records: [
          { ...baseRecord, body: JSON.stringify({ toto: 'totoValue1' }) },
          {
            ...baseRecord,
            body: JSON.stringify({ toto: 'totoValue2' }),
            messageAttributes: {
              tata: { stringValue: 'tataValue', dataType: 'String' },
            },
          },
        ],
      },
      fakeContext,
      () => null,
    );
    expect(result).toEqual([
      {
        bodyToto: 'totoValue1',
        messageAttributesTata: undefined,
      },
      {
        bodyToto: 'totoValue2',
        messageAttributesTata: 'tataValue',
      },
    ]);
  });

  it('should throw if the body of the record is invalid', async () => {
    const handler = getHandler(sqsContract, {
      ajv,
      handleBatchedRecords: false,
    })(async event => {
      await Promise.resolve();

      return event.records[0]!.body.toto;
    });

    await expect(
      handler(
        {
          Records: [
            { ...baseRecord, body: JSON.stringify({ tata: 'totoValue1' }) },
          ],
        },
        fakeContext,
        () => null,
      ),
    ).rejects.toThrowError();
  });

  it('should throw if one of the message attribute of the record is invalid', async () => {
    const handler = getHandler(sqsContract, {
      ajv,
      handleBatchedRecords: false,
    })(async event => {
      await Promise.resolve();

      return event.records[0]!.body.toto;
    });

    await expect(
      handler(
        {
          Records: [
            {
              ...baseRecord,
              body: JSON.stringify({ toto: 'totoValue1' }),
              messageAttributes: {
                titi: { stringValue: 'titiValue', dataType: 'String' },
              },
            },
          ],
        },
        fakeContext,
        () => null,
      ),
    ).rejects.toThrowError();
  });

  it('should not throw it the payload is invalid but validation is disabled in options', async () => {
    const handler = getHandler(sqsContract, {
      ajv,
      validateBody: false,
      handleBatchedRecords: false,
    })(async event => {
      await Promise.resolve();

      return event.records[0]!.body;
    });

    const result = await handler(
      {
        Records: [
          { ...baseRecord, body: JSON.stringify({ tata: 'totoValue1' }) },
        ],
      },
      fakeContext,
      () => null,
    );
    expect(result).toEqual({ tata: 'totoValue1' });
  });

  it('should accept additional arguments', async () => {
    const mockSideEffect = vitest.fn(() => 'tata');
    interface SideEffects {
      mySideEffect: () => string;
    }

    const sideEffects = { mySideEffect: mockSideEffect };

    const handler = getHandler(sqsContract, {
      ajv,
      handleBatchedRecords: false,
    })(async (
      event,
      _context,
      _callback,
      { mySideEffect }: SideEffects = sideEffects,
    ) => {
      await Promise.resolve();

      const sideEffectRes = mySideEffect();

      return `${event.records[0]!.body.toto}-${sideEffectRes}`;
    });

    const result = await handler(
      {
        Records: [
          { ...baseRecord, body: JSON.stringify({ toto: 'totoValue1' }) },
        ],
      },
      fakeContext,
      () => null,
    );
    expect(result).toBe('totoValue1-tata');
    expect(mockSideEffect).toHaveBeenCalledOnce();
  });

  it('should not JSON parse the body if bodyParser is undefined', async () => {
    const handler = getHandler(minimalSqsContract, {
      ajv,
      bodyParser: undefined,
      handleBatchedRecords: false,
    })(async event => {
      await Promise.resolve();

      return event.records[0]!.body;
    });

    const result = await handler(
      {
        Records: [{ ...baseRecord, body: 'myBody' }],
      },
      fakeContext,
      () => null,
    );
    expect(result).toEqual('myBody');
  });
  it('should parse the body with the custom bodyParser if provided', async () => {
    const handler = getHandler(minimalSqsContract, {
      ajv,
      bodyParser: (body: string) => `${body}-parsed`,
      handleBatchedRecords: false,
    })(async event => {
      await Promise.resolve();

      return event.records[0]!.body;
    });

    const result = await handler(
      {
        Records: [{ ...baseRecord, body: 'myBody' }],
      },
      fakeContext,
      () => null,
    );
    expect(result).toEqual('myBody-parsed');
  });
});
