export const UNIT_TYPE = 'px';
export const UNIT = 8;

export const getSpacing = (factor: number): string => {
  return `${factor * UNIT}${UNIT_TYPE}`;
};
