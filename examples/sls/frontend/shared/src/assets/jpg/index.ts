import notFoundImage from './not-found-image.jpg';

export const notFoundJpgUrl = new URL(notFoundImage, import.meta.url).href;
