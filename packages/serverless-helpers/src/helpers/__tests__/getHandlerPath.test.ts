import { getHandlerPath } from '../getHandlerPath';

describe('getHandlerPath', () => {
  it('should return the default path when given no option', () => {
    expect(getHandlerPath('/path/to/file')).toBe('/path/to/file/handler.main');
  });

  it('should customize the filename when given a filename parameter', () => {
    expect(
      getHandlerPath('/path/to/file', {
        fileName: 'toto',
      }),
    ).toBe('/path/to/file/toto.main');
  });
});
