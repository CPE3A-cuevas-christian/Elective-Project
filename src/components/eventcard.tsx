'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Event } from '@/lib/events'
import { categories } from '@/lib/categories'
import { PixelBorder } from './pixelborder'
import { BookmarkButton } from './bookmarkbutton'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const category = categories.find((c) => c.id === event.categoryId)
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <PixelBorder
        interactive
        className="h-full flex flex-col overflow-hidden bg-cream"
      >
        {/* Image Header */}
        <div className="relative h-48 w-full border-b-2 border-dark-brown">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {category && (
            <div
              className={`absolute top-2 left-2 ${category.color} px-2 py-1 pixel-border-sm flex items-center gap-1`}
            >
              <span>{category.icon}</span>
              <span className="font-pixel text-[10px] text-dark-brown">
                {category.name}
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <BookmarkButton eventId={event.id} />
          </div>
          {event.price === 0 && (
            <div className="absolute bottom-2 right-2 bg-green text-cream px-2 py-1 font-pixel text-[10px] pixel-border-sm">
              FREE
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-pixel text-sm leading-relaxed text-dark-brown mb-3 line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex items-center text-sm text-brown">
              <Calendar size={16} className="mr-2 flex-shrink-0" />
              <span>
                {formattedDate} • {event.time}
              </span>
            </div>
            <div className="flex items-center text-sm text-brown">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">
                {event.location}, {event.city}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-light-brown border-dashed">
            <div className="flex items-center text-xs text-brown font-bold">
              <Users size={14} className="mr-1" />
              {event.attendeesCount} players attending
            </div>
            {event.price > 0 && (
              <div className="font-pixel text-xs text-gold text-shadow-pixel">
                ₱{event.price}
              </div>
            )}
          </div>
        </div>
      </PixelBorder>
    </Link>
  )
}

export default EventCard