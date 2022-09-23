import { state } from '__fixtures__/state';

import { getUser } from '../selectors';

/**
 * user selectors test
 */
describe('user slice selectors', () => {
  describe('getUser function', () => {
    it('should return the value stored in store.user', () => {
      expect(getUser(state)).toEqual(state.user);
    });
  });
});
