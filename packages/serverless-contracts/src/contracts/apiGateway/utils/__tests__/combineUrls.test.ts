import { combineUrls } from '../combineUrls';

const expectedUrl = new URL('https://example.com/base/path');

describe('combineUrls', () => {
  it.each([
    {
      baseUrl: 'https://example.com/base',
      path: '/path',
    },
    {
      baseUrl: 'https://example.com/base',
      path: 'path',
    },
    {
      baseUrl: 'https://example.com/base/',
      path: '/path',
    },
    {
      baseUrl: 'https://example.com/base/',
      path: 'path',
    },
  ])(
    'should combine $baseUrl and $path into $expected',
    ({ baseUrl, path }) => {
      expect(combineUrls(path, baseUrl)).toEqual(expectedUrl);
      expect(combineUrls(path, new URL(baseUrl))).toEqual(expectedUrl);
    },
  );
});
