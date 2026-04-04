'use client'

import React, { ReactNode } from 'react'

interface PixelBorderProps {
  children: ReactNode
  className?: string
  interactive?: boolean
  variant?: 'default' | 'small'
  as?: React.ElementType
  onClick?: () => void
}

export function PixelBorder({
  children,
  className = '',
  interactive = false,
  variant = 'default',
  as: Component = 'div',
  onClick,
}: PixelBorderProps) {
  const baseClass = variant === 'small' ? 'pixel-border-sm' : 'pixel-border'
  const interactiveClass = interactive
    ? 'pixel-border-interactive cursor-pointer'
    : ''
  return (
    <Component
      className={`bg-parchment ${baseClass} ${interactiveClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}
