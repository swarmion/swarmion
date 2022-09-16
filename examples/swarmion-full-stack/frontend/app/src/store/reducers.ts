import { combineReducers } from 'redux';

import user, { initialState as userInitialState } from './user/slice';

export const rootInitialState = {
  user: userInitialState,
};

const rootReducers = combineReducers({
  user,
});

export default rootReducers;
