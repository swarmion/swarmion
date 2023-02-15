import '@testing-library/jest-dom/extend-expect';

vi.mock('assets', () => ({
  notFoundJpgUrl: 'notFoundJpgUrl',
  notFoundPngUrl: 'notFoundPngUrl',
  NotFoundIcon: 'NotFoundIcon',
  notFoundWebpUrl: 'notFoundWebpUrl',
}));
