import { render, screen } from 'testUtils/react';

import Title from '../Title';

describe('Title component', () => {
  it("should display the heading 'Page not found'", () => {
    render(<Title />);

    const title = screen.getByRole('heading', {
      name: /Bienvenue sur le frontend de Swarmion/,
    });
    expect(title).toBeInTheDocument();
  });
});
