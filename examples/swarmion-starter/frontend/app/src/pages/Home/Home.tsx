import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { getAxiosRequest } from '@swarmion/serverless-contracts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FormattedMessage } from 'react-intl';

import { healthContract } from '@swarmion-starter/core-contracts';

import { Title } from 'components';
import client from 'services/networking/client';

import { StyledButton, StyledButtonWithTheme } from './Home.style';

const Home = (): React.JSX.Element => {
  const { data: healthResponse, isError } = useQuery({
    queryFn: () =>
      getAxiosRequest(healthContract, client, {}).then(({ data }) => data),
    queryKey: ['health'],
    retry: 1,
  });

  console.log(import.meta.env.BASE_URL);

  const queryClient = useQueryClient();
  const refetchHealth = () => {
    void queryClient.refetchQueries({
      queryKey: ['health'],
      exact: true,
    });
  };

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
        Error: Unable to fetch user
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
        <StyledButton variant="contained" onClick={refetchHealth}>
          <FormattedMessage id="home.button" />
        </StyledButton>
        <StyledButtonWithTheme variant="contained" onClick={refetchHealth}>
          <FormattedMessage id="home.button" />
        </StyledButtonWithTheme>
      </Box>
      <Typography variant="h5">Status from api call</Typography>
      <Box marginTop={6}>{JSON.stringify(healthResponse)}</Box>
    </Box>
  );
};

export default Home;
