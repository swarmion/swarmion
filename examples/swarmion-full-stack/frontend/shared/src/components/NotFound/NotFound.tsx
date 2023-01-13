import { Typography } from '@mui/material';

import { NotFoundIcon } from 'assets';

const NotFound = (): JSX.Element => (
  <>
    <NotFoundIcon />
    <Typography variant="h1">Page not found</Typography>
  </>
);

export default NotFound;
