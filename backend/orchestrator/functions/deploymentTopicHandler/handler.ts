import DeploymentEvent from 'libs/models/deploymentEvent';

interface SnsRecord {
  EventSource: 'aws:sns';
  EventVersion: '1.0';
  EventSubscriptionArn: string;
  Sns: {
    Type: string;
    MessageId: string;
    TopicArn: string;
    Subject: string;
    Message: string;
    Timestamp: string;
    SignatureVersion: string;
    Signature: string;
    SigningCertUrl: string;
    UnsubscribeUrl: string;
    MessageAttributes: Record<string, unknown>;
  };
}

const storeDeploymentRecord = async (record: SnsRecord): Promise<void> => {
  const message = record.Sns.Message;

  const stackIdMatch = new RegExp(/StackId='(?<stackId>[\w\d-:./]+)'\n/).exec(
    message,
  );
  const stackId = stackIdMatch?.groups?.stackId;

  const resourceIdMatch = new RegExp(
    /LogicalResourceId='(?<resourceId>[\w\d-:./]+)'\n/,
  ).exec(message);
  const resourceId = resourceIdMatch?.groups?.resourceId;

  const timestampMatch = new RegExp(
    /Timestamp='(?<timestamp>[\w\d:.-]+)'\n/,
  ).exec(message);
  const timestamp = timestampMatch?.groups?.timestamp;

  const statusMatch = new RegExp(
    /ResourceStatus='(?<status>[\w\d:.-]+)'\n/,
  ).exec(message);
  const status = statusMatch?.groups?.status;

  await DeploymentEvent.put({
    stackId,
    timestamp,
    status,
    resourceId,
    message,
  });
};

export const main = async ({
  Records,
}: {
  Records: SnsRecord[];
}): Promise<void> => {
  await Promise.all(
    Records.map(async record => await storeDeploymentRecord(record)),
  );
};
