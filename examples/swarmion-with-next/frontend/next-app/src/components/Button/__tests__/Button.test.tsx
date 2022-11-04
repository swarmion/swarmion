import { render } from 'testUtils/react';

import { StyledButton, StyledButtonWithTheme } from '../Button.style';

describe('AAU, I can see a StyledButton', () => {
  it('when it is normal', () => {
    render(<StyledButton />);
  });
  it('when it is disabled', () => {
    render(<StyledButton />);
  });
});

describe('AAU, I can see a StyledButtonWithTheme', () => {
  it('when it is normal', () => {
    render(<StyledButtonWithTheme />);
  });
  it('when it is disabled', () => {
    render(<StyledButtonWithTheme />);
  });
});
