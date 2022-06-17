import { CloudFormationTemplate } from 'types';

const BOOTSTRAP_METADATA_PREFIX = 'aws:asset:';

export const throwIfBootstrapMetadataDetected = ({
  Resources,
}: CloudFormationTemplate): void => {
  if (Resources !== undefined) {
    Object.entries(Resources).forEach(([logicalId, resource]) => {
      if ('Metadata' in resource) {
        if (resource.Metadata === undefined) {
          return;
        }

        Object.keys(resource.Metadata).forEach(metadataKey => {
          if (metadataKey.includes(BOOTSTRAP_METADATA_PREFIX)) {
            throw new Error(
              `Resource ${logicalId} cannot be deployed because it needs the bootstrap stack`,
            );
          }
        });
      }
    });
  }
};
