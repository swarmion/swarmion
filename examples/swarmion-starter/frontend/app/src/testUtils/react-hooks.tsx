import {
  RenderHookResult,
  renderHook as rtlRenderHook,
  RenderHookOptions as RtlRenderHookOptions,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { flattenMessages } from 'services/i18n';
import { frFRMessages } from 'translations';

interface RenderHookOptions<P> extends RtlRenderHookOptions<P> {
  messages?: Record<string, string>;
}

const defaultMessages = flattenMessages(frFRMessages);

const renderHook = <P, R>(
  callback: (props: P) => R,
  { messages = defaultMessages, ...renderOptions }: RenderHookOptions<P> = {},
): RenderHookResult<R, P> => {
  const Wrapper: RenderHookOptions<P>['wrapper'] = ({ children }) => (
    <IntlProvider messages={messages} locale="fr" timeZone="Europe/Paris">
      <MemoryRouter>{children}</MemoryRouter>
    </IntlProvider>
  );

  return rtlRenderHook(callback, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { renderHook };
