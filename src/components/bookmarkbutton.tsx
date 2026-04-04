'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import { useBookmarks } from '@/context/bookmarkcontext'

interface BookmarkButtonProps {
  eventId: string
  className?: string
  size?: number
}

export function BookmarkButton({
  eventId,
  className = '',
  size = 24,
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(eventId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark(eventId)
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-none pixel-border-sm bg-cream hover:bg-parchment transition-colors ${className}`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Heart
        size={size}
        className={`transition-colors ${bookmarked ? 'fill-red-500 text-red-500' : 'text-dark-brown'}`}
      />
    </button>
  )
}
