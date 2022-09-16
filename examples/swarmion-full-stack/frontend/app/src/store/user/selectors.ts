import { RootState } from 'store/configureStore';

import { UserData } from './slice';

export const getUser = (state: RootState): UserData => {
  return state.user;
};
