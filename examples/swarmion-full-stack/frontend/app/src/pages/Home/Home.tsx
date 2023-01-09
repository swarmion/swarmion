import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { nanoid } from '@reduxjs/toolkit';
import { getAxiosRequest } from '@swarmion/serverless-contracts';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { getUserContract } from '@swarmion-full-stack/users-contracts';

import { Title } from 'components';
import client from 'services/networking/client';
import { getUser, setUser } from 'store/user';

import { StyledButton, StyledButtonWithTheme } from './Home.style';

const Home = (): JSX.Element => {
  const dispatch = useDispatch();
  const userFromRedux = useSelector(getUser);

  const [userId, setUserId] = useState(nanoid());

  const {
    data: userResponse,
    isError,
  } = useQuery({
    queryFn: () =>
      getAxiosRequest(getUserContract, client, {
        pathParameters: { userId },
      }),
    retry: 1,
    queryKey: ['getUser', userId],
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userResponse === undefined) {
      return;
    }
    dispatch(setUser(userResponse.data));
  }, [dispatch, userResponse]);

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
        <StyledButton variant="contained" onClick={() => setUserId(nanoid())}>
          <FormattedMessage id="home.button" />
        </StyledButton>
        <StyledButtonWithTheme
          variant="contained"
          onClick={() => setUserId(nanoid())}
        >
          <FormattedMessage id="home.button" />
        </StyledButtonWithTheme>
      </Box>
      <Typography variant="h5">User from api call</Typography>
      <Box marginTop={6}>{JSON.stringify(userResponse?.data)}</Box>
      <Typography variant="h5">User from redux</Typography>
      <Box marginTop={6}>{JSON.stringify(userFromRedux)}</Box>
    </Box>
  );
};

export default Home;
