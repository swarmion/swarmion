import {
  RenderHookResult,
  renderHook as rtlRenderHook,
  RenderHookOptions as RtlRenderHookOptions,
} from '@testing-library/react-hooks';
import { ComponentType } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, Store } from 'redux';

import { state } from '__fixtures__/state';
import { flattenMessages } from 'services/i18n';
import { RootState } from 'store/configureStore';
import rootReducers from 'store/reducers';
import { frFRMessages } from 'translations';

interface RenderHookOptions<P> extends RtlRenderHookOptions<P> {
  messages?: Record<string, string>;
  initialState?: RootState;
  store?: Store<RootState>;
}

const defaultMessages = flattenMessages(frFRMessages);

const renderHook = <P, R>(
  callback: (props: P) => R,
  {
    initialState = state,
    store = createStore(rootReducers, initialState),
    messages = defaultMessages,
    ...renderOptions
  }: RenderHookOptions<P> = {},
): RenderHookResult<P, R> => {
  const Wrapper: ComponentType = ({ children }) => (
    <Provider store={store}>
      <IntlProvider messages={messages} locale="fr" timeZone="Europe/Paris">
        <MemoryRouter>{children}</MemoryRouter>
      </IntlProvider>
    </Provider>
  );

  return rtlRenderHook(callback, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react-hooks';
export { renderHook };
