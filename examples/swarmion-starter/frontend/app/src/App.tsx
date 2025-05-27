import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';

import { flattenMessages } from 'services/i18n';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

import AppRoutes from './AppRoutes';

const queryClient = new QueryClient();
const intlMessages = flattenMessages(frFRMessages);

const App = (): React.JSX.Element => {
  return (
    <ThemeProvider theme={muiTheme}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="fr-FR" messages={intlMessages}>
          <CssBaseline />
          <AppRoutes />
        </IntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
