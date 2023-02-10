import { Typography } from '@mui/material';

import { NotFoundIcon, notFoundJpgUrl, notFoundPngUrl } from 'assets';

const NotFound = (): JSX.Element => (
  <>
    <NotFoundIcon />
    <Typography variant="h1">Page not found</Typography>
    <img src={notFoundJpgUrl} alt="page not found jpg" width="180px" />
    <img src={notFoundPngUrl} alt="page not found png" width="180px" />
  </>
);

export default NotFound;
