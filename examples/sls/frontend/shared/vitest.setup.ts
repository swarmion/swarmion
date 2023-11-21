import '@testing-library/jest-dom/vitest';

vi.mock('assets', () => ({
  notFoundJpgUrl: 'notFoundJpgUrl',
  notFoundPngUrl: 'notFoundPngUrl',
  NotFoundIcon: 'svg',
  notFoundWebpUrl: 'notFoundWebpUrl',
}));
