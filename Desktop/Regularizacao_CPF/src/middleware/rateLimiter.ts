import { NextRequest, NextResponse } from 'next/server'

interface RateLimitOptions {
  windowMs: number
  max: number
  message?: string
  skipSuccessfulRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private options: Required<RateLimitOptions>

  constructor(options: RateLimitOptions) {
    this.options = {
      windowMs: options.windowMs,
      max: options.max,
      message: options.message || 'Too many requests, please try again later.',
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    }

    // Limpar store a cada hora
    setInterval(() => {
      this.cleanup()
    }, 60 * 60 * 1000)
  }

  private getKey(request: NextRequest): string {
    // Usar IP do cliente como chave
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    return ip
  }

  private cleanup() {
    const now = Date.now()
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  async check(request: NextRequest): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.getKey(request)
    const now = Date.now()

    if (!this.store[key] || this.store[key].resetTime < now) {
      // Nova janela
      this.store[key] = {
        count: 1,
        resetTime: now + this.options.windowMs,
      }
      return {
        allowed: true,
        remaining: this.options.max - 1,
        resetTime: this.store[key].resetTime,
      }
    }

    // Incrementar contador
    this.store[key].count++

    if (this.store[key].count > this.options.max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: this.store[key].resetTime,
      }
    }

    return {
      allowed: true,
      remaining: this.options.max - this.store[key].count,
      resetTime: this.store[key].resetTime,
    }
  }

  getHeaders(result: { remaining: number; resetTime: number }): Headers {
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', this.options.max.toString())
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
    return headers
  }
}

// Rate limiters pré-configurados
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por 15 minutos
  message: 'Too many API requests, please try again later.',
})

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login por 15 minutos
  message: 'Too many authentication attempts, please try again later.',
})

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // 20 uploads por hora
  message: 'Too many uploads, please try again later.',
})

/**
 * Middleware de rate limiting
 */
export async function rateLimit(
  request: NextRequest,
  limiter: RateLimiter
): Promise<NextResponse | null> {
  const result = await limiter.check(request)

  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      {
        status: 429,
        headers: limiter.getHeaders(result),
      }
    )
  }

  return null
}



