import {
  messageAttributesSchema,
  messageBodySchema,
  sqsContract,
} from './mock';

describe('sqsContract tests', () => {
  it('should be properly initialized', () => {
    expect(sqsContract.id).toBe('myAwesomeSQSContract');
    expect(sqsContract.messageBodySchema).toEqual(messageBodySchema);
    expect(sqsContract.messageAttributesSchema).toBe(messageAttributesSchema);
  });
});
