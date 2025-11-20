import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Single convert endpoint: 100 requests per minute per IP
  convert: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // Batch endpoint: 20 requests per minute per IP (more expensive)
  batch: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
};

// In-memory rate limit store (for serverless, consider Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically (every 5 minutes)
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for IP (handles proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  console.log('cfConnectingIP', cfConnectingIP);
  console.log('realIP', realIP);
  console.log('forwarded', forwarded);
  console.log('request.headers.get("x-forwarded-for")', request.headers.get('x-forwarded-for'));
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  // Fallback to connection remote address
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

/**
 * Check rate limit for a given IP and endpoint
 */
function checkRateLimit(ip: string, endpoint: 'convert' | 'batch'): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMIT_CONFIG[endpoint];
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Validate Content-Type header
 */
function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type');
  return contentType?.includes('application/json') ?? false;
}

/**
 * Validate request body size (max 10MB for batch, 1MB for single)
 */
function validateBodySize(body: string, endpoint: 'convert' | 'batch'): boolean {
  const maxSize = endpoint === 'batch' ? 10 * 1024 * 1024 : 1024 * 1024; // 10MB or 1MB
  return body.length <= maxSize;
}

/**
 * Sanitize and validate address input
 */
function sanitizeAddress(address: string): { valid: boolean; sanitized: string; error?: string } {
  if (!address || typeof address !== 'string') {
    return { valid: false, sanitized: '', error: 'Address must be a non-empty string' };
  }
  
  // Trim whitespace
  const trimmed = address.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', error: 'Address cannot be empty' };
  }
  
  // Maximum address length (CashAddr with prefix can be up to ~62 chars)
  const MAX_ADDRESS_LENGTH = 100;
  if (trimmed.length > MAX_ADDRESS_LENGTH) {
    return { valid: false, sanitized: '', error: `Address exceeds maximum length of ${MAX_ADDRESS_LENGTH} characters` };
  }
  
  // Check for potentially malicious patterns (basic XSS prevention)
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, sanitized: '', error: 'Invalid address format' };
    }
  }
  
  return { valid: true, sanitized: trimmed };
}

/**
 * Main security middleware
 */
export async function validateRequest(
  request: NextRequest,
  endpoint: 'convert' | 'batch'
): Promise<{ valid: boolean; response?: NextResponse; ip?: string }> {
  // 1. Check HTTP method
  if (request.method !== 'POST' && request.method !== 'GET') {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405, headers: { 'Allow': 'POST, GET' } }
      ),
    };
  }
  
  // GET requests are allowed (for documentation)
  if (request.method === 'GET') {
    return { valid: true };
  }
  
  // 2. Get client IP
  const ip = getClientIP(request);
  
  // 3. Check rate limit
  const rateLimit = checkRateLimit(ip, endpoint);
  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    return {
      valid: false,
      response: NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again after ${retryAfter} seconds.`,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG[endpoint].maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      ),
      ip,
    };
  }
  
  // 4. Validate Content-Type
  if (!validateContentType(request)) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Invalid Content-Type. Expected application/json' },
        { status: 400 }
      ),
      ip,
    };
  }
  
  // 5. Validate and parse body
  try {
    const bodyText = await request.text();
    
    // Check body size
    if (!validateBodySize(bodyText, endpoint)) {
      const maxSize = endpoint === 'batch' ? '10MB' : '1MB';
      return {
        valid: false,
        response: NextResponse.json(
          { error: `Request body too large. Maximum size is ${maxSize}` },
          { status: 413 }
        ),
        ip,
      };
    }
    
    // Parse JSON
    const body = JSON.parse(bodyText);
    
    // Validate body structure
    if (endpoint === 'convert') {
      if (!body.address) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: 'Address parameter is required' },
            { status: 400 }
          ),
          ip,
        };
      }
      
      // Sanitize address
      const addressValidation = sanitizeAddress(body.address);
      if (!addressValidation.valid) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: addressValidation.error || 'Invalid address format' },
            { status: 400 }
          ),
          ip,
        };
      }
    } else if (endpoint === 'batch') {
      if (!body.addresses || !Array.isArray(body.addresses)) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: 'Addresses array is required' },
            { status: 400 }
          ),
          ip,
        };
      }
      
      if (body.addresses.length === 0) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: 'Addresses array cannot be empty' },
            { status: 400 }
          ),
          ip,
        };
      }
      
      // Validate array size
      const MAX_BATCH_SIZE = 10000;
      if (body.addresses.length > MAX_BATCH_SIZE) {
        return {
          valid: false,
          response: NextResponse.json(
            { error: `Batch size exceeds maximum of ${MAX_BATCH_SIZE} addresses` },
            { status: 400 }
          ),
          ip,
        };
      }
      
      // Validate each address
      for (let i = 0; i < body.addresses.length; i++) {
        const addr = body.addresses[i];
        if (typeof addr !== 'string') {
          return {
            valid: false,
            response: NextResponse.json(
              { error: `Address at index ${i} must be a string` },
              { status: 400 }
            ),
            ip,
          };
        }
        
        const addressValidation = sanitizeAddress(addr);
        if (!addressValidation.valid) {
          return {
            valid: false,
            response: NextResponse.json(
              { error: `Invalid address at index ${i}: ${addressValidation.error}` },
              { status: 400 }
            ),
            ip,
          };
        }
      }
    }
    
    // Attach parsed body to request for use in route handler
    (request as any)._validatedBody = body;
    
    return { valid: true, ip };
  } catch (error: any) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        ),
        ip,
      };
    }
    
    // Handle other errors
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      ),
      ip,
    };
  }
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  ip: string,
  endpoint: 'convert' | 'batch'
): NextResponse {
  const key = `${ip}:${endpoint}`;
  const entry = rateLimitStore.get(key);
  const config = RATE_LIMIT_CONFIG[endpoint];
  
  if (entry) {
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
  }
  
  return response;
}

