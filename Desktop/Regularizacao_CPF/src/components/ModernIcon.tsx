'use client'

import { motion } from 'framer-motion'
import { 
  FileCheck, 
  Globe, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Target,
  BarChart3,
  FolderOpen,
  UserCheck,
  Shield,
  Network,
  Footprints,
  Handshake,
  FileText,
  Download,
  ArrowRight,
  Calendar,
  Building2,
  CreditCard,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import IconWrapper from './IconWrapper'

interface ModernIconProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  glow?: boolean
  gradient?: boolean
  animated?: boolean
  color?: 'primary' | 'accent' | 'white' | 'green' | 'yellow'
  inline?: boolean // Se true, renderiza como span para uso inline
}

const iconMap: Record<string, any> = {
  'file-check': FileCheck,
  'globe': Globe,
  'lock': Lock,
  'check': CheckCircle2,
  'x': XCircle,
  'alert': AlertTriangle,
  'target': Target,
  'chart': BarChart3,
  'folder': FolderOpen,
  'user': UserCheck,
  'shield': Shield,
  'network': Network,
  'footprints': Footprints,
  'handshake': Handshake,
  'document': FileText,
  'download': Download,
  'arrow-right': ArrowRight,
  'calendar': Calendar,
  'building': Building2,
  'credit-card': CreditCard,
  'mail': Mail,
  'phone': Phone,
  'map-pin': MapPin,
}

const colorClasses = {
  primary: 'text-primary-600',
  accent: 'text-accent-500',
  white: 'text-white',
  green: 'text-primary-500',
  yellow: 'text-accent-400',
}

export default function ModernIcon({
  name,
  size = 'md',
  className = '',
  glow = true,
  gradient = false,
  animated = true,
  color = 'primary',
  inline = false,
}: ModernIconProps) {
  const IconComponent = iconMap[name.toLowerCase()]

  if (!IconComponent) {
    return null
  }

  // Se className contém "inline", assume uso inline
  const isInline = inline || className.includes('inline')

  return (
    <IconWrapper
      size={size}
      className={className}
      glow={glow}
      gradient={gradient}
      animated={animated}
      as={isInline ? 'span' : 'div'}
    >
      <IconComponent 
        className={`${colorClasses[color]} ${size === 'xl' ? 'w-12 h-12' : size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6'}`}
        strokeWidth={size === 'xl' ? 2.5 : size === 'lg' ? 2 : 1.5}
      />
    </IconWrapper>
  )
}

