import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { FormattedMessage } from 'react-intl';

import { StyledButton, StyledButtonWithTheme, Title } from 'components';
import client from 'services/networking/client';

const Home = (): React.JSX.Element => {
  const {
    data: response,
    isError,
    refetch,
  } = useQuery({
    queryFn: () => client.get('hello'),
    retry: 1,
    queryKey: ['hello'],
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignContent="center"
        textAlign="center"
        height="100vh"
        maxWidth="100%"
      >
        Error: Unable to call /hello
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignContent="center"
      textAlign="center"
      height="100vh"
      maxWidth="100%"
    >
      <Title />
      <Box marginTop={6}>
        <StyledButton variant="contained" onClick={() => void refetch()}>
          <FormattedMessage id="home.button" />
        </StyledButton>
        <StyledButtonWithTheme
          variant="contained"
          onClick={() => void refetch()}
        >
          <FormattedMessage id="home.button" />
        </StyledButtonWithTheme>
      </Box>
      <Typography variant="h5">message</Typography>
      <Box marginTop={6}>{JSON.stringify(response?.data)}</Box>
    </Box>
  );
};

export default Home;
