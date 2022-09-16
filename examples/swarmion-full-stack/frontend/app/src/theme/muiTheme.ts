import '@mui/lab/themeAugmentation';
import { createTheme, ThemeOptions } from '@mui/material/styles';

import { UNIT } from './helpers';
import { MuiButtonOverrides } from './overrides';
import { MuiTypographyVariants } from './variants';

export const muiThemeObject: ThemeOptions = {
  spacing: UNIT,
  palette: {
    text: {
      primary: '#2E2E2E',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: MuiButtonOverrides,
    },
    MuiTypography: {
      variants: MuiTypographyVariants,
    },
  },
};

const muiTheme = createTheme(muiThemeObject);

export default muiTheme;
