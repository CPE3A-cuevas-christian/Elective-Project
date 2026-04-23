'use client'

import React, { useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  MapPin,
  Filter,
  ArrowUpDown,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { categories } from '@/lib/categories'

type SearchBarProps = {
  initialQuery?: string
  initialCity?: string
  initialCategory?: string
  initialSort?: string
  cityOptions?: string[]
}

type FilterOption = {
  value: string
  label: string
}

type FilterSelectProps = {
  icon: LucideIcon
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

function FilterSelect({
  icon: Icon,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center gap-3 border-2 px-4 py-3 text-left transition-all ${
          isOpen
            ? 'border-dark-brown bg-white shadow-[0_0_0_2px_#f0dfb5]'
            : 'border-brown bg-white hover:bg-cream'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Icon size={18} className="text-brown flex-shrink-0" />
        <span className="min-w-0 flex-1 truncate font-bold text-brown">
          {selectedOption?.label ?? value}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-brown transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.45rem)] z-30 overflow-hidden border-2 border-brown bg-white shadow-[6px_6px_0px_#6b4423]">
          <div className="max-h-72 overflow-y-auto bg-[linear-gradient(180deg,#fffdf8_0%,#fff7e7_100%)] p-1.5">
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`mb-1 flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors last:mb-0 ${
                    isSelected
                      ? 'bg-brown font-bold text-cream'
                      : 'text-dark-brown hover:bg-parchment'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="truncate pr-3">{option.label}</span>
                  {isSelected && (
                    <span className="font-pixel text-[10px] uppercase tracking-wide">
                      Selected
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function SearchBar({
  initialQuery = '',
  initialCity = 'All Locations',
  initialCategory = 'all',
  initialSort = 'distance',
  cityOptions = ['All Locations'],
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity || 'All Locations')
  const [category, setCategory] = useState(initialCategory || 'all')
  const [sort, setSort] = useState(initialSort || 'distance')

  const uniqueCities = useMemo(() => {
    const set = new Set<string>()
    set.add('All Locations')

    cityOptions.forEach((city) => {
      if (city && city.trim()) {
        set.add(city)
      }
    })

    return Array.from(set)
  }, [cityOptions])

  const cityDropdownOptions = useMemo(
    () =>
      uniqueCities.map((cityOption) => ({
        value: cityOption,
        label: cityOption,
      })),
    [uniqueCities],
  )

  const categoryDropdownOptions = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ],
    [],
  )

  const sortDropdownOptions = useMemo(
    () => [
      { value: 'distance', label: 'Closest First' },
      { value: 'date', label: 'Upcoming Date' },
      { value: 'category', label: 'Category' },
    ],
    [],
  )

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }

    if (city && city !== 'All Locations') {
      params.set('city', city)
    } else {
      params.delete('city')
    }

    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    if (sort) {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }

    const next = params.toString()
    router.push(next ? `${pathname}?${next}` : pathname)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-4 border-brown bg-parchment p-2 shadow-[4px_4px_0px_#6b4423]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_0.95fr_0.95fr_0.95fr_0.7fr] gap-2">
        <div className="flex items-center border-2 border-brown bg-white px-4 py-3">
          <Search size={18} className="text-brown mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, festivals..."
            className="w-full bg-transparent outline-none border-none ring-0 focus:outline-none focus:ring-0 text-brown placeholder:text-light-brown font-medium"
          />
        </div>

        <FilterSelect
          icon={MapPin}
          value={city}
          options={cityDropdownOptions}
          onChange={setCity}
        />

        <FilterSelect
          icon={Filter}
          value={category}
          options={categoryDropdownOptions}
          onChange={setCategory}
        />

        <FilterSelect
          icon={ArrowUpDown}
          value={sort}
          options={sortDropdownOptions}
          onChange={setSort}
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 border-2 border-brown bg-green hover:bg-dark-green text-cream px-4 py-3 font-pixel text-xs transition-colors"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  )
}
