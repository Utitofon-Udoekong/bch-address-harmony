import { NextRequest, NextResponse } from 'next/server';
import { convertAddress } from '../../utils/address-converter';
import { validateRequest, addRateLimitHeaders } from '../../utils/api-security';

export async function POST(request: NextRequest) {
  // Security validation
  const validation = await validateRequest(request, 'convert');
  if (!validation.valid) {
    return validation.response!;
  }

  try {
    // Get validated body from security middleware
    const body = (request as any)._validatedBody;
    const { address } = body;

    // Additional validation (should already be done, but double-check)
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Address parameter required' },
        { status: 400 }
      );
    }

    // Convert address
    const result = convertAddress(address.trim());
    
    // Build response with rate limit headers
    const response = NextResponse.json({
      ...result,
      success: true
    });

    // Add rate limit headers
    if (validation.ip) {
      return addRateLimitHeaders(response, validation.ip, 'convert');
    }

    return response;

  } catch (error: any) {
    // Don't leak internal error details
    console.error('Address conversion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Invalid address format',
        success: false 
      },
      { status: 400 }
    );
  }
}

// GET endpoint for API documentation
export async function GET() {
  return NextResponse.json({
    name: 'BCH Address Harmony API',
    version: '1.0.0',
    endpoint: '/api/convert',
    method: 'POST',
    description: 'Convert BCH addresses between Legacy and CashAddr formats',
    request: {
      body: {
        address: 'string (required) - Legacy or CashAddr format'
      }
    },
    response: {
      original: 'string - Original input address',
      originalType: 'string - Original format detected',
      legacy: 'string - Legacy format (1xxx or 3xxx)',
      cashAddrWithPrefix: 'string - CashAddr with bitcoincash: prefix',
      cashAddrNoPrefix: 'string - CashAddr without prefix',
      addressType: 'string - P2PKH or P2SH',
      success: 'boolean - Whether conversion succeeded'
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
  });
}

