'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { Event } from '@/lib/events'
import { EventCard } from './eventcard'

interface RecommendationSectionProps {
  events: Event[]
}

export function RecommendationSection({ events }: RecommendationSectionProps) {
  const recommendedEvents = events.filter((e) => e.isFeatured).slice(0, 4)

  if (recommendedEvents.length === 0) return null

  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <Star className="text-gold fill-gold" size={28} />
        <h2 className="font-pixel text-lg md:text-xl text-dark-brown">
          Recommended For You
        </h2>
      </div>

      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x">
        {recommendedEvents.map((event) => (
          <div
            key={event.id}
            className="min-w-[280px] md:min-w-[320px] max-w-[320px] snap-start flex-shrink-0"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  )
}
