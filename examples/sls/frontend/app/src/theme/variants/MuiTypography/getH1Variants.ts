import { ComponentsVariants } from '@mui/material';

const getH1Variants = (): NonNullable<ComponentsVariants['MuiTypography']> => {
  return [
    {
      props: { variant: 'h1' },
      style: {
        fontWeight: 700,
        fontSize: '28px',
      },
    },
  ];
};

export default getH1Variants;
