import { NextRequest, NextResponse } from 'next/server';
import { convertAddress, validateAddress } from '../../utils/address-converter';
import { validateRequest, addRateLimitHeaders } from '../../utils/api-security';

export async function POST(request: NextRequest) {
  // Security validation
  const validation = await validateRequest(request, 'batch');
  if (!validation.valid) {
    return validation.response!;
  }

  try {
    // Get validated body from security middleware
    const body = (request as any)._validatedBody;
    const { addresses } = body;

    // Additional validation (should already be done, but double-check)
    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Addresses array required' },
        { status: 400 }
      );
    }

    if (addresses.length === 0) {
      return NextResponse.json(
        { error: 'Addresses array cannot be empty' },
        { status: 400 }
      );
    }

    // Limit batch size to prevent abuse
    const MAX_BATCH_SIZE = 10000;
    if (addresses.length > MAX_BATCH_SIZE) {
      return NextResponse.json(
        { error: `Batch size exceeds maximum of ${MAX_BATCH_SIZE}` },
        { status: 400 }
      );
    }

    // Process addresses with timeout protection
    const results = addresses.map((addr: string, index: number) => {
      try {
        const trimmed = addr?.toString().trim() || '';
        
        if (!trimmed) {
          return {
            index: index + 1,
            input: addr || '',
            success: false,
            error: 'Empty address'
          };
        }

        // Validate and convert
        if (validateAddress(trimmed)) {
          const converted = convertAddress(trimmed);
          return {
            index: index + 1,
            input: trimmed,
            legacy: converted.legacy,
            cashAddrWithPrefix: converted.cashAddrWithPrefix,
            cashAddrNoPrefix: converted.cashAddrNoPrefix,
            addressType: converted.addressType,
            success: true
          };
        } else {
          return {
            index: index + 1,
            input: trimmed,
            success: false,
            error: 'Invalid address format'
          };
        }
      } catch (error: any) {
        // Don't leak internal error details
        console.error(`Batch conversion error at index ${index}:`, error);
        return {
          index: index + 1,
          input: addr?.toString() || '',
          success: false,
          error: 'Conversion failed'
        };
      }
    });

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    // Build response with rate limit headers
    const response = NextResponse.json({
      total: addresses.length,
      successful: successCount,
      failed: failCount,
      results
    });

    // Add rate limit headers
    if (validation.ip) {
      return addRateLimitHeaders(response, validation.ip, 'batch');
    }

    return response;

  } catch (error: any) {
    // Don't leak internal error details
    console.error('Batch processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Batch processing failed'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for API documentation
export async function GET() {
  return NextResponse.json({
    name: 'BCH Address Harmony Batch API',
    version: '1.0.0',
    endpoint: '/api/batch',
    method: 'POST',
    description: 'Batch convert multiple BCH addresses between Legacy and CashAddr formats',
    request: {
      body: {
        addresses: 'string[] (required) - Array of addresses to convert (max 10000)'
      }
    },
    response: {
      total: 'number - Total number of addresses processed',
      successful: 'number - Number of successful conversions',
      failed: 'number - Number of failed conversions',
      results: 'array - Array of conversion results with index, input, output formats, and status'
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
    },
    limits: {
      maxBatchSize: 10000,
      rateLimit: '20 requests per minute per IP address',
      requestBodySize: 'Maximum 10MB'
    }
  });
}

