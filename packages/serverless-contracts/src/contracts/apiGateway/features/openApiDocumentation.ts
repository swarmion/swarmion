import { OpenAPIV3 } from 'openapi-types';

import { ContractOpenApiDocumentation } from 'types/contractOpenApiDocumentation';

import { GenericApiGatewayContract } from '../apiGatewayContract';

export const getOpenApiDocumentation = <
  Contract extends GenericApiGatewayContract,
>(
  contract: Contract,
): ContractOpenApiDocumentation => {
  const initialDocumentation: OpenAPIV3.OperationObject = {
    responses: {},
  };

  // add responses to the object
  const contractDocumentation = Object.keys(contract.outputSchemas).reduce(
    (config, responseCode) => {
      // @ts-expect-error Typescript does not infer the key type with Object.keys
      const schema = contract.outputSchemas[
        responseCode
      ] as OpenAPIV3.SchemaObject;

      return {
        ...config,
        responses: {
          ...config.responses,
          [responseCode]: {
            description: `Response: ${responseCode}`,
            content: {
              'application/json': {
                // This cast is done because there is differences between JsonSchema and OpenAPIV3.SchemaObject specs
                // It may be fixed later
                // @ref https://swagger.io/specification/
                schema,
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
          // This cast is done because there is differences between JsonSchema and OpenAPIV3.SchemaObject specs
          // It may be fixed later
          // @ref https://swagger.io/specification/
          schema: variableDefinition as OpenAPIV3.SchemaObject,
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
          // This cast is done because there is differences between JsonSchema and OpenAPIV3.SchemaObject specs
          // It may be fixed later
          // @ref https://swagger.io/specification/
          schema: variableDefinition as OpenAPIV3.SchemaObject,
          required:
            contract.queryStringParametersSchema?.required?.includes(
              variableName,
            ) ?? false,
        }),
      ),
      ...(contractDocumentation.parameters ?? []),
    ];
  }

  if (contract.bodySchema !== undefined) {
    contractDocumentation.requestBody = {
      content: {
        'application/json': {
          // This cast is done because there is differences between JsonSchema and OpenAPIV3.SchemaObject specs
          // It may be fixed later
          // @ref https://swagger.io/specification/
          schema: contract.bodySchema as OpenAPIV3.SchemaObject,
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
