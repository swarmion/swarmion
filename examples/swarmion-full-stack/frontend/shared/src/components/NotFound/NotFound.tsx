import { Typography } from '@mui/material';

import { NotFoundIcon, notFoundPngUrl } from 'assets';

const NotFound = (): JSX.Element => (
  <>
    <NotFoundIcon />
    <Typography variant="h1">Page not found</Typography>
    <img src={notFoundPngUrl} alt="page not found png" width="180px" />
  </>
);

export default NotFound;
