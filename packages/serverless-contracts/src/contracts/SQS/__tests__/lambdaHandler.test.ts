import Ajv from 'ajv';
import { expect } from 'vitest';

import { getHandlerContextMock } from '__mocks__/requestContext';
import { getHandler } from 'features/lambdaHandler';

import { baseRecord, minimalSqsContract, sqsContract } from './mock';

const ajv = new Ajv({ keywords: ['faker'] });
const simpleHandlerMock = vi.fn();

describe('SQSContract handler test', () => {
  const fakeContext = getHandlerContextMock();
  const fakeCallback = () => null;

  it('should call the handler with all the records', async () => {
    const handler = getHandler(sqsContract, { ajv })(simpleHandlerMock);

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
      fakeCallback,
    );
    expect(simpleHandlerMock).toHaveBeenCalledTimes(2);
    expect(simpleHandlerMock).toHaveBeenCalledWith(
      {
        ...baseRecord,
        body: { toto: 'totoValue1' },
      },
      fakeContext,
      fakeCallback,
    );
    expect(simpleHandlerMock).toHaveBeenCalledWith(
      {
        ...baseRecord,
        body: { toto: 'totoValue2' },
        messageAttributes: {
          tata: 'tataValue',
        },
      },
      fakeContext,
      fakeCallback,
    );
    expect(result).toEqual({
      batchItemFailures: [],
    });
  });

  it('should throw if the body of the record is invalid', async () => {
    const handler = getHandler(sqsContract, { ajv })(simpleHandlerMock);

    await expect(
      handler(
        {
          Records: [
            { ...baseRecord, body: JSON.stringify({ tata: 'totoValue1' }) },
          ],
        },
        fakeContext,
        fakeCallback,
      ),
    ).rejects.toThrowError();
  });

  it('should throw if one of the message attribute of the record is invalid', async () => {
    const handler = getHandler(sqsContract, { ajv })(simpleHandlerMock);

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
        fakeCallback,
      ),
    ).rejects.toThrowError();
  });

  it('should not throw it the payload is invalid but validation is disabled in options', async () => {
    const handler = getHandler(sqsContract, {
      ajv,
      validateBody: false,
    })(simpleHandlerMock);

    const result = await handler(
      {
        Records: [
          { ...baseRecord, body: JSON.stringify({ tata: 'totoValue1' }) },
        ],
      },
      fakeContext,
      fakeCallback,
    );
    expect(simpleHandlerMock).toHaveBeenCalledOnce();
    expect(simpleHandlerMock).toHaveBeenCalledWith(
      {
        ...baseRecord,
        body: { tata: 'totoValue1' },
      },
      fakeContext,
      fakeCallback,
    );
    expect(result).toEqual({
      batchItemFailures: [],
    });
  });

  it('should accept additional arguments', async () => {
    const mockSideEffect = vitest.fn();
    interface SideEffects {
      mySideEffect: (value: string) => Promise<void>;
    }

    const sideEffects = { mySideEffect: mockSideEffect };

    const handler = getHandler(sqsContract, { ajv })(async (
      record,
      _context,
      _callback,
      { mySideEffect }: SideEffects = sideEffects,
    ) => {
      await mySideEffect(record.body.toto);
    });

    const result = await handler(
      {
        Records: [
          { ...baseRecord, body: JSON.stringify({ toto: 'totoValue1' }) },
        ],
      },
      fakeContext,
      fakeCallback,
    );
    expect(result).toEqual({
      batchItemFailures: [],
    });
    expect(mockSideEffect).toHaveBeenCalledOnce();
    expect(mockSideEffect).toHaveBeenCalledWith('totoValue1');
  });

  it('should not JSON parse the body if bodyParser is undefined', async () => {
    const handler = getHandler(minimalSqsContract, {
      ajv,
      bodyParser: undefined,
    })(simpleHandlerMock);

    const result = await handler(
      {
        Records: [{ ...baseRecord, body: 'myBody' }],
      },
      fakeContext,
      fakeCallback,
    );
    expect(simpleHandlerMock).toHaveBeenCalledOnce();
    expect(simpleHandlerMock).toHaveBeenCalledWith(
      {
        ...baseRecord,
        body: 'myBody',
      },
      fakeContext,
      fakeCallback,
    );
    expect(result).toEqual({
      batchItemFailures: [],
    });
  });
  it('should parse the body with the custom bodyParser if provided', async () => {
    const handler = getHandler(minimalSqsContract, {
      ajv,
      bodyParser: (body: string) => `${body}-parsed`,
    })(simpleHandlerMock);

    const result = await handler(
      {
        Records: [{ ...baseRecord, body: 'myBody' }],
      },
      fakeContext,
      fakeCallback,
    );
    expect(simpleHandlerMock).toHaveBeenCalledOnce();
    expect(simpleHandlerMock).toHaveBeenCalledWith(
      {
        ...baseRecord,
        body: 'myBody-parsed',
      },
      fakeContext,
      fakeCallback,
    );
    expect(result).toEqual({
      batchItemFailures: [],
    });
  });
  it('should return the messageId of failed records', async () => {
    simpleHandlerMock
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('my Error'))
      .mockResolvedValueOnce(undefined);

    const handler = getHandler(sqsContract, { ajv })(simpleHandlerMock);

    const result = await handler(
      {
        Records: [
          {
            ...baseRecord,
            messageId: '1',
            body: JSON.stringify({ toto: 'totoValue1' }),
          },
          {
            ...baseRecord,
            messageId: '2',
            body: JSON.stringify({ toto: 'totoValue2' }),
          },
          {
            ...baseRecord,
            messageId: '3',
            body: JSON.stringify({ toto: 'totoValue3' }),
          },
        ],
      },
      fakeContext,
      fakeCallback,
    );
    expect(simpleHandlerMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      batchItemFailures: [{ itemIdentifier: '2' }],
    });
  });
});
