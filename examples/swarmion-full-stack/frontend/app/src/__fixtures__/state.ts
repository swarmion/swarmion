import { RootState } from 'store/configureStore';

import { user } from './user';

export const state: RootState = {
  user,
};

export const emptyState: RootState = {
  user: null,
};
