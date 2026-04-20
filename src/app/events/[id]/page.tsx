'use client'

import React, { use, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  ChevronLeft,
  User,
  Tag,
  Bookmark,
} from 'lucide-react'
import { categories } from '@/lib/categories'
import { PixelBorder } from '@/components/pixelborder'

declare global {
  interface Window {
    google: typeof google
  }
}

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-places-photo-script'

type DbEvent = {
  id: number
  organizerName: string
  name: string
  description: string
  category: string
  location: string
  date: string
  time: string
  createdAt?: string
  updatedAt?: string
}

function normalizeCategory(raw: string) {
  const value = raw.trim().toLowerCase()

  const byId = categories.find((c) => c.id.toLowerCase() === value)
  if (byId) return byId

  const byName = categories.find((c) => c.name.toLowerCase() === value)
  if (byName) return byName

  return null
}

function extractCityFromLocation(location: string) {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length >= 3) {
    return parts[parts.length - 3]
  }

  if (parts.length >= 2) {
    return parts[parts.length - 2]
  }

  return parts[0] || 'Unknown'
}

async function loadGoogleMapsPlaces(): Promise<void> {
  if (window.google?.maps?.places?.PlacesService) return

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_MAPS_SCRIPT_ID,
    ) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google Maps Places')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_MAPS_SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps Places'))
    document.head.appendChild(script)
  })
}

async function getPlacePhotoByAddress(address: string): Promise<string | null> {
  await loadGoogleMapsPlaces()

  return new Promise((resolve) => {
    const container = document.createElement('div')
    const service = new window.google.maps.places.PlacesService(container)

    const request: google.maps.places.TextSearchRequest = {
      query: address,
    }

    service.textSearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results.length > 0
      ) {
        const placeWithPhoto = results.find(
          (place) => place.photos && place.photos.length > 0,
        )

        if (placeWithPhoto?.photos?.[0]) {
          const url = placeWithPhoto.photos[0].getUrl({
            maxWidth: 1200,
            maxHeight: 600,
          })
          resolve(url)
          return
        }
      }

      resolve(null)
    })
  })
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()

  const resolvedParams = use(params)
  const eventId = resolvedParams.id

  const [event, setEvent] = useState<DbEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [placeImageUrl, setPlaceImageUrl] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true)

        const res = await fetch(`/api/events/${eventId}`, {
          method: 'GET',
          credentials: 'include',
        })

        const data = await res.json()

        console.log('EVENT DETAIL RESPONSE:', data)

        if (!res.ok) {
          setError(data.error || 'Failed to load event.')
          return
        }

        setEvent(data.event)
      } catch (err) {
        console.error('FETCH EVENT DETAIL ERROR:', err)
        setError('Failed to load event.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      if (!event?.location) return

      try {
        setImageLoading(true)
        setImageFailed(false)
        setPlaceImageUrl('')

        const photoUrl = await getPlacePhotoByAddress(event.location)

        if (photoUrl) {
          setPlaceImageUrl(photoUrl)
        } else {
          setImageFailed(true)
        }
      } catch (err) {
        console.error('PLACE PHOTO ERROR:', err)
        setImageFailed(true)
      } finally {
        setImageLoading(false)
      }
    }

    fetchPlacePhoto()
  }, [event?.location])

  const category = useMemo(
    () => (event ? normalizeCategory(event.category) : null),
    [event],
  )

  const city = useMemo(
    () => (event ? extractCityFromLocation(event.location) : 'Unknown'),
    [event],
  )

  const formattedDate = useMemo(() => {
    if (!event) return ''

    const dateObj = new Date(event.date)
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }, [event])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-pixel text-2xl text-dark-brown mb-4">
          Loading Event...
        </h1>
        <p className="text-brown">
          Please wait while we load the event details.
        </p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-pixel text-2xl text-dark-brown mb-4">
          Event Not Found
        </h1>

        <p className="text-brown mb-8">
          {error || 'The event you are looking for might have ended or moved.'}
        </p>

        <button
          onClick={() => router.push('/events')}
          className="bg-green text-white px-6 py-3 font-pixel text-xs pixel-border-sm"
        >
          Back to Events
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-brown hover:text-dark-brown font-bold mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" /> Back
        </button>

        <PixelBorder className="overflow-hidden bg-parchment mb-8">
          <div className="relative h-56 md:h-80 w-full border-b-4 border-dark-brown bg-white">
            {imageLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <div className="text-center px-4">
                  <div className="font-pixel text-lg text-dark-brown mb-2">
                    Loading Image...
                  </div>
                  <div className="text-brown text-sm">
                    Getting image from Google Places.
                  </div>
                </div>
              </div>
            ) : placeImageUrl && !imageFailed ? (
              <img
                src={placeImageUrl}
                alt={event.location}
                className="w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <div className="text-center px-4">
                  <div className="font-pixel text-lg text-dark-brown mb-2">
                    No Image Found
                  </div>
                  <div className="text-brown text-sm">
                    No Google Places photo is available for this address.
                  </div>
                </div>
              </div>
            )}

            {category && (
              <div
                className={`absolute top-4 left-4 ${category.color} px-3 py-2 pixel-border-sm flex items-center gap-2 shadow-lg`}
              >
                <span className="text-xl">
                  {category.icon || category.emoji}
                </span>
                <span className="font-pixel text-xs text-dark-brown">
                  {category.name}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div className="flex-1">
                <h1 className="font-pixel text-2xl md:text-3xl text-dark-brown mb-4 leading-tight">
                  {event.name}
                </h1>

                <div className="space-y-3 text-brown font-medium">
                  <div className="flex items-center">
                    <Calendar className="mr-3 text-green" size={20} />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="mr-3 text-green" size={20} />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mr-3 text-green mt-0.5" size={20} />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center">
                    <Tag className="mr-3 text-green" size={20} />
                    <span>{city}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 bg-white p-4 pixel-border-sm flex flex-col gap-4">
                <div className="text-center pb-4 border-b-2 border-light-brown border-dashed">
                  <div className="text-sm text-brown font-bold uppercase mb-1">
                    Category
                  </div>

                  <div className="font-pixel text-sm text-dark-brown">
                    {category?.name || event.category}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const saved = JSON.parse(
                      localStorage.getItem('bookmarkedEvents') || '[]',
                    )

                    const alreadySaved = saved.some(
                      (item: DbEvent) => item.id === event.id,
                    )

                    if (!alreadySaved) {
                      saved.push(event)
                      localStorage.setItem(
                        'bookmarkedEvents',
                        JSON.stringify(saved),
                      )
                      alert('Event bookmarked!')
                    } else {
                      alert('Event already bookmarked!')
                    }
                  }}
                  className="w-full bg-green hover:bg-dark-green text-cream py-3 font-pixel text-[10px] pixel-border-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Bookmark size={16} />
                  Bookmark Event
                </button>

                <button
                  onClick={async () => {
                    const eventLink = `${window.location.origin}/events/${event.id}`

                    try {
                      await navigator.clipboard.writeText(eventLink)
                      alert('Event link copied!')
                    } catch (err) {
                      console.error(err)
                      alert('Failed to copy event link.')
                    }
                  }}
                  className="w-full flex justify-center items-center gap-2 bg-sky hover:bg-blue-400 text-dark-brown py-2 pixel-border-sm transition-colors"
                >
                  <Share2 size={20} />
                  <span className="font-pixel text-[10px]">Share</span>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-pixel text-lg text-dark-brown mb-4 border-b-2 border-brown pb-2">
                About this Event
              </h2>

              <p className="text-dark-brown leading-relaxed whitespace-pre-line text-lg">
                {event.description}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t-2 border-brown">
              <div>
                <div className="text-sm text-brown font-bold mb-2">
                  Organized by:
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brown rounded-full pixel-border-sm flex items-center justify-center text-cream">
                    <User size={18} />
                  </div>

                  <span className="font-pixel text-xs text-dark-brown">
                    {event.organizerName}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-cream border-2 border-brown text-dark-brown px-3 py-1 text-xs font-bold">
                  #{city}
                </span>

                <span className="bg-cream border-2 border-brown text-dark-brown px-3 py-1 text-xs font-bold">
                  #{(category?.name || event.category).replace(/\s+/g, '')}
                </span>
              </div>
            </div>
          </div>
        </PixelBorder>
      </div>
    </div>
  )
}