import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, createStore, Store } from 'redux';

import reducer, { rootInitialState } from './reducers';

export type RootState = ReturnType<typeof reducer>;

type AppStore = Store<RootState>;

const configureStore = (preloadedState = rootInitialState): AppStore => {
  if (process.env.NODE_ENV === 'production') {
    return createStore(reducer, preloadedState, applyMiddleware());
  }

  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware()),
  );
};

export default configureStore;
