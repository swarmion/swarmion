import { getCdkHandlerPath } from '../getCdkHandlerPath';

describe('getCdkHandlerPath', () => {
  it('should return the default path when given no option', () => {
    expect(getCdkHandlerPath('/path/to/file')).toBe('/path/to/file/handler.ts');
  });

  it('should customize the extension when given an extension parameter', () => {
    expect(getCdkHandlerPath('/path/to/file', { extension: 'mjs' })).toBe(
      '/path/to/file/handler.mjs',
    );
  });

  it('should customize the filename when given a filename parameter', () => {
    expect(
      getCdkHandlerPath('/path/to/file', {
        fileName: 'toto',
      }),
    ).toBe('/path/to/file/toto.ts');
  });
});
