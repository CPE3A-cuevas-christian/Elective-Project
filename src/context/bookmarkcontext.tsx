'use client'

//bookmark ng events kapag nakalogin na

import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react'

interface BookmarkContextType {
  bookmarkedIds: string[]
  toggleBookmark: (eventId: string) => void
  isBookmarked: (eventId: string) => boolean
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('bookmarks')
    if (stored) {
      setBookmarkedIds(JSON.parse(stored))
    }
  }, [])

  const toggleBookmark = (eventId: string) => {
    setBookmarkedIds((prev) => {
      const newBookmarks = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }

  const isBookmarked = (eventId: string) => bookmarkedIds.includes(eventId)

  if (!mounted) {
    return (
      <BookmarkContext.Provider
        value={{
          bookmarkedIds: [],
          toggleBookmark: () => {},
          isBookmarked: () => false,
        }}
      >
        {children}
      </BookmarkContext.Provider>
    )
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedIds,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }
  return context
}
