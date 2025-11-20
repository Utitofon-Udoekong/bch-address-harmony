import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'BCH Address Harmony API',
    version: '1.0.0',
    description: 'RESTful API for converting Bitcoin Cash addresses between Legacy and CashAddr formats',
    baseUrl: '/api',
    endpoints: [
      {
        path: '/api/convert',
        method: 'POST',
        description: 'Convert a single BCH address between Legacy and CashAddr formats',
        request: {
          contentType: 'application/json',
          body: {
            address: {
              type: 'string',
              required: true,
              description: 'BCH address in Legacy (1xxx/3xxx) or CashAddr format (with or without bitcoincash: prefix)',
              examples: [
                '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
                'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a'
              ]
            }
          }
        },
        response: {
          success: {
            status: 200,
            body: {
              original: 'string - Original input address',
              originalType: 'string - "Legacy Format" or "CashAddr Format"',
              legacy: 'string - Legacy format address (1xxx or 3xxx)',
              cashAddrWithPrefix: 'string - CashAddr format with bitcoincash: prefix',
              cashAddrNoPrefix: 'string - CashAddr format without prefix',
              addressType: 'string - "P2PKH" or "P2SH"',
              success: 'boolean - true'
            }
          },
          error: {
            status: 400,
            body: {
              error: 'string - Error message',
              success: 'boolean - false'
            }
          }
        },
        example: {
          request: {
            address: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu'
          },
          response: {
            original: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
            originalType: 'Legacy Format',
            legacy: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
            cashAddrWithPrefix: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
            cashAddrNoPrefix: 'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
            addressType: 'P2PKH',
            success: true
          }
        }
      },
      {
        path: '/api/batch',
        method: 'POST',
        description: 'Batch convert multiple BCH addresses',
        request: {
          contentType: 'application/json',
          body: {
            addresses: {
              type: 'string[]',
              required: true,
              description: 'Array of BCH addresses to convert (max 10,000)',
              maxLength: 10000
            }
          }
        },
        response: {
          success: {
            status: 200,
            body: {
              total: 'number - Total number of addresses processed',
              successful: 'number - Number of successful conversions',
              failed: 'number - Number of failed conversions',
              results: 'array - Array of conversion results, each containing: index, input, legacy, cashAddrWithPrefix, cashAddrNoPrefix, addressType, success, error (if failed)'
            }
          },
          error: {
            status: 400,
            body: {
              error: 'string - Error message'
            }
          }
        },
        example: {
          request: {
            addresses: [
              '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
              'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a'
            ]
          },
          response: {
            total: 2,
            successful: 2,
            failed: 0,
            results: [
              {
                index: 1,
                input: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
                legacy: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
                cashAddrWithPrefix: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                cashAddrNoPrefix: 'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                addressType: 'P2PKH',
                success: true
              },
              {
                index: 2,
                input: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                legacy: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
                cashAddrWithPrefix: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                cashAddrNoPrefix: 'qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
                addressType: 'P2PKH',
                success: true
              }
            ]
          }
        }
      },
      {
        path: '/api/convert',
        method: 'GET',
        description: 'Get API documentation for the convert endpoint',
        response: {
          status: 200,
          body: 'JSON object with endpoint documentation'
        }
      },
      {
        path: '/api/batch',
        method: 'GET',
        description: 'Get API documentation for the batch endpoint',
        response: {
          status: 200,
          body: 'JSON object with endpoint documentation'
        }
      }
    ],
    rateLimits: {
      note: 'No specific rate limits enforced, but please use responsibly'
    },
    support: {
      hackathon: 'Bitcoin Cash Hackathon 2024',
      bounty: 'United Address Format Bounty'
    }
  });
}

