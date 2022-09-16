import { user } from '__fixtures__/user';

import reducer, { initialState, setUser } from '../slice';

/**
 * user reducers test
 */
describe('user reducers', () => {
  describe('setUser', () => {
    it('should return updated user with null initial state', () => {
      const action = setUser(user);
      const expectedState = user;

      expect(reducer(null, action)).toEqual(expectedState);
    });

    it('should return updated user', () => {
      const action = setUser(user);
      const expectedState = user;

      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
});
