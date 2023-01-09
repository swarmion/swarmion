import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { flattenMessages } from 'services/i18n';
import configureStore from 'store/configureStore';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

import AppRoutes from './AppRoutes';

const queryClient = new QueryClient();
const intlMessages = flattenMessages(frFRMessages);

const App = (): JSX.Element => {
  const store = configureStore();

  return (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <IntlProvider locale="fr-FR" messages={intlMessages}>
            <CssBaseline />
            <AppRoutes />
          </IntlProvider>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
