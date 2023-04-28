import notFoundImage from './not-found.png';

export const notFoundPngUrl = new URL(notFoundImage, import.meta.url).href;
