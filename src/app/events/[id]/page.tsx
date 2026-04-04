'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Clock, Users, Share2, ChevronLeft } from 'lucide-react'
import { events } from '@/lib/events'
import { categories } from '@/lib/categories'
import { PixelBorder } from '@/components/pixelborder'
import { BookmarkButton } from '@/components/bookmarkbutton'

export default function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const event = events.find((e) => e.id === params.id)

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-pixel text-2xl text-dark-brown mb-4">
          Event Not Found
        </h1>
        <p className="text-brown mb-8">
          The event you are looking for might have ended or moved.
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

  const category = categories.find((c) => c.id === event.categoryId)
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-cream py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-brown hover:text-dark-brown font-bold mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" /> Back
        </button>

        <PixelBorder className="overflow-hidden bg-parchment mb-8">
          {/* Header Image */}
          <div className="relative h-64 md:h-96 w-full border-b-4 border-dark-brown">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {category && (
              <div
                className={`absolute top-4 left-4 ${category.color} px-3 py-2 pixel-border-sm flex items-center gap-2 shadow-lg`}
              >
                <span className="text-xl">{category.icon}</span>
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
                  {event.title}
                </h1>

                <div className="space-y-3 text-brown font-medium">
                  <div className="flex items-center">
                    <Calendar
                      className="mr-3 text-green"
                      size={20}
                    />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-3 text-green" size={20} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-3 text-green" size={20} />
                    <span>
                      {event.location}, {event.city}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-3 text-green" size={20} />
                    <span>{event.attendeesCount} players attending</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="w-full md:w-64 bg-white p-4 pixel-border-sm flex flex-col gap-4">
                <div className="text-center pb-4 border-b-2 border-light-brown border-dashed">
                  <div className="text-sm text-brown font-bold uppercase mb-1">
                    Entry Fee
                  </div>
                  <div className="font-pixel text-xl text-gold text-shadow-pixel">
                    {event.price === 0 ? 'FREE' : `₱${event.price}`}
                  </div>
                </div>

                <button className="w-full bg-green hover:bg-dark-green text-cream py-3 font-pixel text-[10px] pixel-border-sm transition-colors">
                  Register Now
                </button>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <BookmarkButton
                      eventId={event.id}
                      className="w-full flex justify-center py-2"
                      size={20}
                    />
                  </div>
                  <button className="flex-1 flex justify-center items-center bg-sky hover:bg-blue-400 text-dark-brown py-2 pixel-border-sm transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-pixel text-lg text-dark-brown mb-4 border-b-2 border-brown pb-2">
                About this Event
              </h2>
              <p className="text-dark-brown leading-relaxed whitespace-pre-line text-lg">
                {event.description}
              </p>
            </div>

            {/* Tags & Organizer */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t-2 border-brown">
              <div>
                <div className="text-sm text-brown font-bold mb-2">
                  Organized by:
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brown rounded-full pixel-border-sm overflow-hidden">
                    <img
                      src={`https://placehold.co/100x100/5c3d0e/FFF8DC?text=${event.organizer.charAt(0)}`}
                      alt={event.organizer}
                    />
                  </div>
                  <span className="font-pixel text-xs text-dark-brown">
                    {event.organizer}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-cream border-2 border-brown text-dark-brown px-3 py-1 text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </PixelBorder>
      </div>
    </div>
  )
}
