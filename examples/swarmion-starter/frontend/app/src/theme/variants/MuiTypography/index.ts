import getH1Variants from './getH1Variants';
import getH2Variants from './getH2Variants';

export const MuiTypographyVariants = [...getH1Variants(), ...getH2Variants()];

export { default as getH1Variants } from './getH1Variants';
export { default as getH2Variants } from './getH2Variants';
