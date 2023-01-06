import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useAsync } from '@react-hookz/web';
import { FormattedMessage } from 'react-intl';

import { StyledButton, StyledButtonWithTheme, Title } from 'components';
import client from 'services/networking/client';

const Home = (): JSX.Element => {
  // TODO : use react-query
  const [{ result, error }, { execute }] = useAsync(() => client.get('hello'));

  if (error) {
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
        Error: {error.message}
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
        <StyledButton variant="contained" onClick={() => void execute()}>
          <FormattedMessage id="home.button" />
        </StyledButton>
        <StyledButtonWithTheme
          variant="contained"
          onClick={() => void execute()}
        >
          <FormattedMessage id="home.button" />
        </StyledButtonWithTheme>
      </Box>
      <Typography variant="h5">message</Typography>
      <Box marginTop={6}>{JSON.stringify(result?.data)}</Box>
    </Box>
  );
};

export default Home;
