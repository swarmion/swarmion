export type PutRequestedContractEvent = (payload: {
  serviceId: string;
  applicationId: string;
  eventId: string;
}) => Promise<unknown>;
