import { ThemeProvider } from '@mui/system';
import {
  RenderResult,
  render as rtlRender,
  RenderOptions as RtlRenderOptions,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

import { flattenMessages } from 'services/i18n';
import { muiTheme } from 'theme';
import { frFRMessages } from 'translations';

interface RenderOptions extends RtlRenderOptions {
  messages?: Record<string, string>;
  initialEntries?: MemoryRouterProps['initialEntries'];
}

const defaultMessages = flattenMessages(frFRMessages);

/**
 * Render the component passed and wrap it with its providers
 */
const render = (
  ui: React.ReactElement,
  {
    messages = defaultMessages,
    initialEntries = ['/'],
    ...renderOptions
  }: RenderOptions = {},
): RenderResult => {
  const Wrapper: React.ComponentType = ({ children }) => (
    <ThemeProvider theme={muiTheme}>
      <IntlProvider messages={messages} locale="fr" timeZone="Europe/Paris">
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </IntlProvider>
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { render };
