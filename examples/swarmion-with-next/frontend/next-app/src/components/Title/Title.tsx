import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const Title = (): JSX.Element => (
  <Typography variant="h1">
    <FormattedMessage id="home.title" />
  </Typography>
);

export default Title;
