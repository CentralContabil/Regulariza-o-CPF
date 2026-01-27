'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface IconWrapperProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  glow?: boolean
  gradient?: boolean
  animated?: boolean
  as?: 'div' | 'span' // Permite renderização inline quando necessário
}

export default function IconWrapper({
  children,
  size = 'md',
  className = '',
  glow = true,
  gradient = false,
  animated = true,
  as = 'div',
}: IconWrapperProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }

  const MotionComponent = as === 'span' ? motion.span : motion.div
  const inlineClasses = as === 'span' ? 'inline-flex' : 'flex'

  return (
    <MotionComponent
      className={`
        ${sizeClasses[size]}
        ${glow ? 'icon-glow-strong' : ''}
        ${gradient ? 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg shadow-primary-500/50' : ''}
        ${animated ? 'animate-float' : ''}
        ${inlineClasses} items-center justify-center
        transition-all duration-500 ease-out
        hover-lift
        ${className}
      `}
      whileHover={{ 
        scale: 1.15, 
        rotate: [0, -5, 5, -5, 0],
        filter: 'brightness(1.2) saturate(1.2)',
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        rotate: { duration: 0.5 }
      }}
    >
      <div className="relative">
        {children}
        {glow && (
          <>
            <motion.div
              className="absolute inset-0 bg-primary-400/40 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 bg-accent-400/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </>
        )}
      </div>
    </MotionComponent>
  )
}

