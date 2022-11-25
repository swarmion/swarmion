import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import type { AppProps } from 'next/app';
import { IntlProvider } from 'react-intl';

import { flattenMessages } from 'services/i18n';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

const intlMessages = flattenMessages(frFRMessages);

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ThemeProvider theme={muiTheme}>
      <IntlProvider locale="fr-FR" messages={intlMessages}>
        <CssBaseline />
        <Component {...pageProps} />
      </IntlProvider>
    </ThemeProvider>
  );
};

export default App;
