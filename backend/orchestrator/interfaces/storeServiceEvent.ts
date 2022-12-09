export type StoreServiceEventType = (payload: {
  serviceId: string;
  applicationId: string;
  eventId: string;
}) => Promise<void>;
