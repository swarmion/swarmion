import { ContractSchemasLocation } from 'types/locations';
import { ServerlessContractSchemas } from 'types/serviceOptions';

export const printContractSchemas = (
  { provides, consumes }: ServerlessContractSchemas,
  contractSchemasLocation: ContractSchemasLocation,
): void => {
  console.log(
    `--- Serverless contract schemas for location ${contractSchemasLocation} ---`,
  );
  console.log();
  console.log('-- Provides --');
  console.log(JSON.stringify(provides, null, 2));
  console.log();
  console.log('-- Consumes --');
  console.log(JSON.stringify(consumes, null, 2));
};
