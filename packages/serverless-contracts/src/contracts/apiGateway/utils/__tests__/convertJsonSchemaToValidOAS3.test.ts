/* eslint-disable max-lines */
import { convertJsonSchemaToValidOAS3 } from '../';

describe('convertJsonSchemaToValidOAS3', () => {
  it('should replace examples keyword with example by taking the first item', () => {
    const schemaWithExamples = {
      type: 'string',
      examples: ['75010', '20120'],
      pattern: '^[0-9]{5}$',
    } as const;

    expect(convertJsonSchemaToValidOAS3(schemaWithExamples)).toEqual({
      type: 'string',
      pattern: '^[0-9]{5}$',
      example: '75010',
    });
  });

  it('should replace const keywords with enum', () => {
    const schemaWithConstKeywords = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            description: 'Value of the price must be in cents',
          },
          currency: {
            type: 'string',

            // => here
            const: 'EUR',
          },
        },
        additionalProperties: false,
        required: ['amount', 'currency', 'frequency'],
      },
    } as const;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(convertJsonSchemaToValidOAS3(schemaWithConstKeywords)).toEqual({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          amount: {
            type: 'integer',
            description: 'Value of the price must be in cents',
          },
          currency: {
            type: 'string',
            enum: ['EUR'],
          },
        },
        additionalProperties: false,
        required: ['amount', 'currency', 'frequency'],
      },
    });
  });

  it('should convert Json nullable format to OAS3 nullable format', () => {
    const schemaWithNullableValue = {
      type: 'object',
      properties: {
        quoteUuid: {
          type: 'string',
          format: 'uuid',
        },
        journeyUuid: {
          type: 'string',
          format: 'uuid',
        },
        policyUuid: { type: 'string', format: 'uuid' },
        isCompanyQuoteAccepted: { type: 'boolean' },

        // => here
        firstNullableSchema: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        // => and here
        secondNullableSchema: { type: ['number', 'null'] },
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(convertJsonSchemaToValidOAS3(schemaWithNullableValue)).toEqual({
      type: 'object',
      properties: {
        quoteUuid: {
          type: 'string',
          format: 'uuid',
        },
        journeyUuid: {
          type: 'string',
          format: 'uuid',
        },
        policyUuid: { type: 'string', format: 'uuid' },
        isCompanyQuoteAccepted: { type: 'boolean' },

        // => here
        firstNullableSchema: {
          anyOf: [{ type: 'number' }, { nullable: true }],
        },
        // => and here
        secondNullableSchema: { type: 'number', nullable: true },
      },
    });
  });

  it('should convert Json schema with array to OAS3 format', () => {
    const schemaWithArray = {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: {
                type: ['string', 'null'],
              },
            },
            addtionnalProperties: true,
            required: ['id', 'name'],
          },
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(convertJsonSchemaToValidOAS3(schemaWithArray)).toEqual({
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: {
                type: 'string',
                nullable: true,
              },
            },
            addtionnalProperties: true,
            required: ['id', 'name'],
          },
        },
      },
    });
  });

  it('should convert Json schema with additionalProperties to OAS3 format', () => {
    const schemaWithAdditionalProperties = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      additionalProperties: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: ['string', 'null'],
          },
        },
      },
    };

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      convertJsonSchemaToValidOAS3(schemaWithAdditionalProperties),
    ).toEqual({
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      additionalProperties: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
            nullable: true,
          },
        },
      },
    });
  });

  it('should convert Json schema with patternPropeties to OAS3 format', () => {
    const schemaWithPatternProperties = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      patternProperties: {
        '^S_': { type: ['string', 'null'] },
        '^I_': { type: 'integer' },
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(convertJsonSchemaToValidOAS3(schemaWithPatternProperties)).toEqual({
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
      patternProperties: {
        '^S_': { type: 'string', nullable: true },
        '^I_': { type: 'integer' },
      },
    });
  });

  it('should convert Json schema with oneOf, anyOf, allOf, not to OAS3 format', () => {
    const schemaWithCombinatoryOperators = {
      type: 'object',
      properties: {
        anyOfSchema: {
          anyOf: [{ type: ['number', 'null'] }],
        },
        allOfSchema: {
          allOf: [{ type: ['number', 'null'] }],
        },
        oneOfSchema: {
          oneOf: [{ type: ['number', 'null'] }],
        },
        notSchema: {
          not: { type: ['number', 'null'] },
        },
      },
    };

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      convertJsonSchemaToValidOAS3(schemaWithCombinatoryOperators),
    ).toEqual({
      type: 'object',
      properties: {
        anyOfSchema: {
          anyOf: [{ type: 'number', nullable: true }],
        },
        allOfSchema: {
          allOf: [{ type: 'number', nullable: true }],
        },
        oneOfSchema: {
          oneOf: [{ type: 'number', nullable: true }],
        },
        notSchema: {
          not: { type: 'number', nullable: true },
        },
      },
    });
  });

  it('should convert Json schema with definitions to OAS3 format', () => {
    const schemaWithDefinitions = {
      $id: 'https://example.com/schemas/customer',
      $schema: 'https://json-schema.org/draft/2020-12/schema',

      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        shipping_address: { $ref: '/schemas/address' },
        billing_address: { $ref: '/schemas/address' },
      },
      required: [
        'first_name',
        'last_name',
        'shipping_address',
        'billing_address',
      ],

      $defs: {
        address: {
          $id: '/schemas/address',
          $schema: 'http://json-schema.org/draft-07/schema#',

          type: 'object',
          properties: {
            street_address: { type: 'string' },
            city: { type: 'string' },
            state: { $ref: '#/definitions/state' },
          },
          required: ['street_address', 'city', 'state'],

          definitions: {
            state: { enum: ['CA', 'NY'] },
          },
        },
      },
    };

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      convertJsonSchemaToValidOAS3(schemaWithDefinitions),
    ).toEqual({
      $id: 'https://example.com/schemas/customer',
      $schema: 'https://json-schema.org/draft/2020-12/schema',

      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        shipping_address: { $ref: '/schemas/address' },
        billing_address: { $ref: '/schemas/address' },
      },
      required: [
        'first_name',
        'last_name',
        'shipping_address',
        'billing_address',
      ],

      $defs: {
        address: {
          $id: '/schemas/address',
          $schema: 'http://json-schema.org/draft-07/schema#',

          type: 'object',
          properties: {
            street_address: { type: 'string' },
            city: { type: 'string' },
            state: { $ref: '#/definitions/state' },
          },
          required: ['street_address', 'city', 'state'],

          definitions: {
            state: { enum: ['CA', 'NY'] },
          },
        },
      },
    });
  });
});
