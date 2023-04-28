import notFoundImage from './image.webp';

export const notFoundWebpUrl = new URL(notFoundImage, import.meta.url).href;
