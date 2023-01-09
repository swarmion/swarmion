import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { getAxiosRequest } from '@swarmion/serverless-contracts';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { getUserContract } from '@swarmion-full-stack/users-contracts';

import { Title } from 'components';
import client from 'services/networking/client';

import { StyledButton, StyledButtonWithTheme } from './Home.style';

const Home = (): JSX.Element => {
  const [userId, setUserId] = useState(uuidv4());

  const { data: userResponse, isError } = useQuery({
    queryFn: () =>
      getAxiosRequest(getUserContract, client, {
        pathParameters: { userId },
      }),
    retry: 1,
    queryKey: ['getUser', userId],
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
        <StyledButton variant="contained" onClick={() => setUserId(uuidv4())}>
          <FormattedMessage id="home.button" />
        </StyledButton>
        <StyledButtonWithTheme
          variant="contained"
          onClick={() => setUserId(uuidv4())}
        >
          <FormattedMessage id="home.button" />
        </StyledButtonWithTheme>
      </Box>
      <Typography variant="h5">User from api call</Typography>
      <Box marginTop={6}>{JSON.stringify(userResponse?.data)}</Box>
    </Box>
  );
};

export default Home;
