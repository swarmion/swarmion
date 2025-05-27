import { Typography } from '@mui/material';

import {
  NotFoundIcon,
  notFoundJpgUrl,
  notFoundPngUrl,
  notFoundWebpUrl,
} from 'assets';

const NotFound = (): React.JSX.Element => (
  <>
    <NotFoundIcon />
    <Typography variant="h1">Page not found</Typography>
    <img src={notFoundJpgUrl} alt="page not found jpg" width="180px" />
    <img src={notFoundPngUrl} alt="page not found png" width="180px" />
    <img src={notFoundWebpUrl} alt="page not found webp" width="180px" />
  </>
);

export default NotFound;
