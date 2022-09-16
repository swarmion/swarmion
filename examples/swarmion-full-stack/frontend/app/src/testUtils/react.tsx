import { ThemeProvider } from '@mui/system';
import {
  RenderResult,
  render as rtlRender,
  RenderOptions as RtlRenderOptions,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { createStore, Store } from 'redux';

import { state } from '__fixtures__/state';
import { flattenMessages } from 'services/i18n';
import { RootState } from 'store/configureStore';
import rootReducers from 'store/reducers';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

interface RenderOptions extends RtlRenderOptions {
  messages?: Record<string, string>;
  initialState?: RootState;
  store?: Store<RootState>;
  initialEntries?: MemoryRouterProps['initialEntries'];
}

const defaultMessages = flattenMessages(frFRMessages);

/**
 * Render the component passed and wrap it in a redux provider, making it possible to test redux functionalities
 */
const render = (
  ui: React.ReactElement,
  {
    initialState = state,
    store = createStore(rootReducers, initialState),
    messages = defaultMessages,
    initialEntries = ['/'],
    ...renderOptions
  }: RenderOptions = {},
): RenderResult => {
  const Wrapper: React.ComponentType = ({ children }) => (
    <ThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <IntlProvider messages={messages} locale="fr" timeZone="Europe/Paris">
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </IntlProvider>
      </Provider>
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { render };
