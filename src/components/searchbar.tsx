'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Filter } from 'lucide-react'
import { PixelBorder } from './pixelborder'
import { categories } from '@/lib/categories'

const CITIES = [
  'All Locations',
    'City A',
    'City B',   
    'City C',
    'City D',
    'City E',
    'City F',
]

interface SearchBarProps {
  initialQuery?: string
  initialCity?: string
  initialCategory?: string
  onSearch?: (query: string, city: string, category: string) => void
  compact?: boolean
}

export function SearchBar({
  initialQuery = '',
  initialCity = 'All Locations',
  initialCategory = 'all',
  onSearch,
  compact = false,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const [category, setCategory] = useState(initialCategory)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query, city, category)
    } else {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (city !== 'All Locations') params.append('city', city)
      if (category !== 'all') params.append('category', category)
      router.push(`/events?${params.toString()}`)
    }
  }

  return (
    <PixelBorder className="p-2 bg-cream">
      <form
        onSubmit={handleSearch}
        className={`flex flex-col ${compact ? 'md:flex-row' : 'lg:flex-row'} gap-2`}
      >
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-brown" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, festivals..."
            className="w-full pl-10 pr-3 py-3 bg-white border-2 border-brown focus:outline-none focus:border-dark-green font-sans text-dark-brown placeholder-light-brown"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={18} className="text-brown" />
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-white border-2 border-brown focus:outline-none focus:border-dark-green font-sans text-dark-brown appearance-none cursor-pointer"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="relative md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-brown" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-3 bg-white border-2 border-brown focus:outline-none focus:border-dark-green font-sans text-dark-brown appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green hover:bg-dark-green text-cream px-6 py-3 font-pixel text-[10px] pixel-border-sm transition-colors flex items-center justify-center gap-2"
        >
          <Search size={16} />
          <span>Search</span>
        </button>
      </form>
    </PixelBorder>
  )
}
