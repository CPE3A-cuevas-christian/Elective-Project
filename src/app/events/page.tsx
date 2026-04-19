'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/searchbar'
import { EventCard } from '@/components/eventcard'
import { events } from '@/lib/events'
import { categories } from '@/lib/categories'

function EventsPageContent() {
  const searchParams = useSearchParams()
  const [filteredEvents, setFilteredEvents] = useState(events)

  const query = searchParams.get('q') || ''
  const city = searchParams.get('city') || 'All Locations'
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'date'

  useEffect(() => {
    let result = [...events]

    // Filter by query
    if (query) {
      const lowerQuery = query.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(lowerQuery) ||
          e.description.toLowerCase().includes(lowerQuery),
      )
    }

    const location =
      city && city !== 'All Locations' ? city : 'Philippines'

    const url =
      `https://www.eventbriteapi.com/v3/events/search/` +
      `?location.address=${encodeURIComponent(location)}` +
      `&token=${token}`

    const response = await fetch(url, {
      method: 'GET',
    })

    const raw = await response.text()
    console.log('Eventbrite raw response:', raw)

    let data: any = {}

    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      return NextResponse.json(
        {
          error: {
            message: 'Eventbrite did not return valid JSON',
          },
        },
        { status: 500 }
      )
    }

    console.log('Eventbrite status:', response.status)
    console.log('Eventbrite response:', data)

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            message:
              data?.error_description ||
              data?.error ||
              'Failed to fetch Eventbrite events',
          },
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error)

    return NextResponse.json(
      {
        error: {
          message: 'Internal server error',
        },
      },
      { status: 500 }
    )
  }
}