import { ComponentsVariants } from '@mui/material';

const getH2Variants = (): NonNullable<ComponentsVariants['MuiTypography']> => {
  return [
    {
      props: { variant: 'h2' },
      style: {
        fontWeight: 700,
        fontSize: '20px',
      },
    },
  ];
};

export default getH2Variants;
