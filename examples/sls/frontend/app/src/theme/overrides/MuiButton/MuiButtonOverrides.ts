import { ComponentsOverrides } from '@mui/material';

const MuiButtonOverrides: ComponentsOverrides['MuiButton'] = {
  root: {
    textTransform: 'none',
    fontSize: '20px',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  },
};

export default MuiButtonOverrides;
