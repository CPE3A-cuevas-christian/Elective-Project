'use client'

import { ReactNode } from 'react'
import { BookmarkProvider } from '@/context/bookmarkcontext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BookmarkProvider>{children}</BookmarkProvider>
  )
}
