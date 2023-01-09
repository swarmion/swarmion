import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { IntlProvider } from 'react-intl';

import { flattenMessages } from 'services/i18n';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

const queryClient = new QueryClient();
const intlMessages = flattenMessages(frFRMessages);

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ThemeProvider theme={muiTheme}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="fr-FR" messages={intlMessages}>
          <CssBaseline />
          <Component {...pageProps} />
        </IntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
