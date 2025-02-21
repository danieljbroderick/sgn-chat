import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the origin of the request
  const origin = request.headers.get('origin')
  
  // Get the API key from the request headers
  const apiKey = request.headers.get('x-api-key')
  
  // Load allowed origins from environment variable
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
  
  // Check if the origin is allowed
  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Validate API key
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return new NextResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // If all checks pass, set CORS headers and continue
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

// Specify which routes should be protected by the middleware
export const config = {
  matcher: '/api/:path*',
} 