import { NextRequest } from 'next/server'

/**
 * Headers de segurança
 */
export function securityHeaders(): Headers {
  const headers = new Headers()

  // Prevenir clickjacking
  headers.set('X-Frame-Options', 'DENY')

  // Prevenir MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff')

  // Habilitar XSS protection
  headers.set('X-XSS-Protection', '1; mode=block')

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )

  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  )

  // Strict Transport Security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return headers
}

/**
 * Middleware para adicionar headers de segurança
 */
export function withSecurityHeaders(handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const response = await handler(request, ...args)
    const headers = securityHeaders()

    // Adicionar headers à resposta
    headers.forEach((value, key) => {
      response.headers.set(key, value)
    })

    return response
  }
}

/**
 * Validação de CSRF token
 */
export function validateCSRF(request: NextRequest): boolean {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return true
  }

  const token = request.headers.get('x-csrf-token')
  const cookieToken = request.cookies.get('csrf-token')?.value

  if (!token || !cookieToken || token !== cookieToken) {
    return false
  }

  return true
}

/**
 * Sanitização de entrada
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remover tags HTML
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim()
}

/**
 * Validação de origem
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  if (!origin && !referer) {
    // Permitir requisições sem origem (ex: Postman, curl)
    return process.env.NODE_ENV !== 'production'
  }

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',')

  if (origin && allowedOrigins.includes(origin)) {
    return true
  }

  if (referer) {
    const refererUrl = new URL(referer)
    return allowedOrigins.some((allowed) => {
      try {
        const allowedUrl = new URL(allowed)
        return allowedUrl.origin === refererUrl.origin
      } catch {
        return false
      }
    })
  }

  return false
}

