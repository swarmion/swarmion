import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export const LOCATION_HTML_ELEMENT_TEST_ID = 'location-test';

type WrapperForLocationTestingProps = {
  children: ReactNode;
};

const WrapperForLocationTesting = ({
  children,
}: WrapperForLocationTestingProps): React.JSX.Element => {
  const location = useLocation();

  return (
    <>
      {children}
      <div data-testid={LOCATION_HTML_ELEMENT_TEST_ID}>
        {JSON.stringify(location)}
      </div>
    </>
  );
};

export default WrapperForLocationTesting;
