import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/configureStore';

export const REDUX_STORE_HTML_ELEMENT_TEST_ID = 'redux-store';

type ReduxSelector = (rootState: RootState) => unknown;
type WrapperForReduxTestingProps = {
  selector: ReduxSelector;
  children: ReactNode;
};

const WrapperForReduxTesting = ({
  selector,
  children,
}: WrapperForReduxTestingProps): JSX.Element => {
  const state = useSelector(selector);

  return (
    <>
      {children}
      <div data-testid={REDUX_STORE_HTML_ELEMENT_TEST_ID}>
        {JSON.stringify(state)}
      </div>
    </>
  );
};

export default WrapperForReduxTesting;
