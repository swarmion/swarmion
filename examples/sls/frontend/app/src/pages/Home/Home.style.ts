import { Button } from '@mui/material';
import { css } from '@mui/system';

import { styled } from 'theme';

const StyledButtonWithTheme = styled(Button)(
  ({ theme }) => css`
    background: ${theme.palette.secondary.main};
  `,
);

const StyledButton = styled(Button)`
  background: blueviolet;
`;

export { StyledButton, StyledButtonWithTheme };
