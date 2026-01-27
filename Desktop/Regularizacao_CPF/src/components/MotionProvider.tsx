'use client'

import { useEffect } from 'react'
import { initAllMotion } from '@/lib/motion'

/**
 * Provider para inicializar o sistema de motion no cliente
 */
export default function MotionProvider() {
  useEffect(() => {
    // Inicializar sistema de motion após montagem
    initAllMotion()
  }, [])

  return null
}



