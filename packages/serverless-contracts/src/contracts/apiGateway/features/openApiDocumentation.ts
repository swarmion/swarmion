import isUndefined from 'lodash/isUndefined.js';
import omitBy from 'lodash/omitBy.js';
import { OpenAPIV3 } from 'openapi-types';

import { ContractOpenApiDocumentation } from 'types/contractOpenApiDocumentation';

import { GenericApiGatewayContract } from '../apiGatewayContract';
import { convertJsonSchemaToValidOAS3 } from '../utils';

export const getContractDocumentation = <
  Contract extends GenericApiGatewayContract,
>(
  contract: Contract,
): ContractOpenApiDocumentation => {
  const initialDocumentation: OpenAPIV3.OperationObject = {
    responses: {},
  };

  const definedOutputSchema = omitBy(contract.outputSchemas, isUndefined);

  // add responses to the object
  const contractDocumentation = Object.keys(definedOutputSchema).reduce(
    (config, responseCode) => {
      const schema = definedOutputSchema[responseCode];

      if (schema === undefined) {
        return config;
      }

      const openApiSchema = convertJsonSchemaToValidOAS3(schema);

      return {
        ...config,
        responses: {
          ...config.responses,
          [responseCode]: {
            description: `Response: ${responseCode}`,
            content: {
              'application/json': {
                schema: openApiSchema,
              },
            },
          },
        },
      };
    },
    initialDocumentation,
  );

  if (contract.pathParametersSchema?.properties !== undefined) {
    contractDocumentation.parameters = [
      ...Object.entries(contract.pathParametersSchema.properties).map(
        ([variableName, variableDefinition]) => ({
          name: variableName,
          in: 'path',
          schema: convertJsonSchemaToValidOAS3(variableDefinition),
          required:
            contract.pathParametersSchema?.required?.includes(variableName) ??
            false,
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.queryStringParametersSchema?.properties !== undefined) {
    contractDocumentation.parameters = [
      ...Object.entries(contract.queryStringParametersSchema.properties).map(
        ([variableName, variableDefinition]) => ({
          name: variableName,
          in: 'query',
          schema: convertJsonSchemaToValidOAS3(variableDefinition),
          required:
            contract.queryStringParametersSchema?.required?.includes(
              variableName,
            ) ?? false,
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.headersSchema?.properties !== undefined) {
    contractDocumentation.parameters = [
      ...Object.entries(contract.headersSchema.properties).map(
        ([variableName, variableDefinition]) => ({
          name: variableName,
          in: 'header',
          schema: convertJsonSchemaToValidOAS3(variableDefinition),
          required:
            contract.headersSchema?.required?.includes(variableName) ?? false,
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.bodySchema !== undefined) {
    contractDocumentation.requestBody = {
      content: {
        'application/json': {
          schema: convertJsonSchemaToValidOAS3(contract.bodySchema),
        },
      },
    };
  }

  return {
    path: contract.path,
    method: contract.method.toLowerCase(),
    documentation: contractDocumentation,
  };
};
