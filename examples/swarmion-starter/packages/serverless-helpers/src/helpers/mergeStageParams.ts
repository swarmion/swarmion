const mergeStageParams = <
  Stage extends string,
  CommonParamKeys extends string,
  ServiceParamKeys extends string,
>(
  commonStageParams: Record<Stage, Record<CommonParamKeys, unknown>>,
  serviceStageParams: Record<Stage, Record<ServiceParamKeys, unknown>>,
): Record<Stage, Record<CommonParamKeys & ServiceParamKeys, unknown>> => {
  return Object.keys(commonStageParams).reduce(
    (prev, stage) => ({
      ...prev,
      // @ts-expect-error TODO ignore inner typing here
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [stage]: { ...commonStageParams[stage], ...serviceStageParams[stage] },
    }),
    {} as Record<Stage, Record<CommonParamKeys & ServiceParamKeys, unknown>>,
  );
};

export default mergeStageParams;
