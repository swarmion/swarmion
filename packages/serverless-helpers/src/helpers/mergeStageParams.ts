const mergeStageParams = <
  Stage extends string,
  CommonParamKeys extends string,
  ServiceParamKeys extends string,
>(
  commonStageParams: Record<Stage, Record<CommonParamKeys, unknown>>,
  serviceStageParams: Record<Stage, Record<ServiceParamKeys, unknown>>,
): Record<Stage, Record<CommonParamKeys & ServiceParamKeys, unknown>> => {
  return Object.keys(commonStageParams).reduce(
    (prev, stage: Stage) => ({
      ...prev,
      [stage]: { ...commonStageParams[stage], ...serviceStageParams[stage] },
    }),
    {} as Record<Stage, Record<string, unknown>>,
  );
};

export default mergeStageParams;
