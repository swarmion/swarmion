export const combineUrls = (path: string, baseUrl: string | URL): URL => {
  const stringBaseUrl = baseUrl instanceof URL ? baseUrl.toString() : baseUrl;

  const pathWithoutLeadingSlash = path.replace(/^\/+/, '');
  const baseUrlWithTrailingSlash = stringBaseUrl.replace(/\/+$/, '') + '/';

  return new URL(pathWithoutLeadingSlash, baseUrlWithTrailingSlash);
};
