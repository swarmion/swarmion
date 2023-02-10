import { render, screen } from '@testing-library/react';

import NotFound from '../NotFound';

vi.mock('assets', () => ({
  NotFoundIcon: 'svg',
  notFoundPngUrl: 'png',
}));

describe('NotFound component', () => {
  it("should display the heading 'Page not found'", () => {
    render(<NotFound />);

    const pageNotFound = screen.getByRole('heading', {
      name: /Page not found/,
    });
    expect(pageNotFound).toBeInTheDocument();
  });
});
