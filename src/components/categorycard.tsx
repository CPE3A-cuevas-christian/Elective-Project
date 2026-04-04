'use client'

import React from 'react'
import Link from 'next/link'
import { PixelBorder } from './pixelborder'
import { Category } from '@/lib/categories'

interface CategoryCardProps {
  category: Category
  eventCount?: number
}

export function CategoryCard({ category, eventCount }: CategoryCardProps) {
  return (
    <Link href={`/events?category=${category.id}`} className="block h-full">
      <PixelBorder
        interactive
        className="h-full p-4 flex flex-col items-center text-center hover:bg-cream transition-colors"
      >
        <div
          className={`w-16 h-16 ${category.color} rounded-none pixel-border-sm flex items-center justify-center text-3xl mb-3`}
        >
          {category.icon}
        </div>
        <h3 className="font-pixel text-xs leading-relaxed mb-2 text-dark-brown">
          {category.name}
        </h3>
        <p className="text-sm text-brown mb-2 flex-grow">
          {category.description}
        </p>
        {eventCount !== undefined && (
          <span className="text-xs font-bold bg-light-brown text-cream px-2 py-1 pixel-border-sm">
            {eventCount} Events
          </span>
        )}
      </PixelBorder>
    </Link>
  )
}
  