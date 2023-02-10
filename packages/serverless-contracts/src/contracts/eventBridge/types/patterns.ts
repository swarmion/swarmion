export type NativePattern = {
  readonly source: string[];
  readonly 'detail-type': string[];
};

export type EventPattern = {
  readonly detailType?: string[];
  readonly source?: string[];
};
