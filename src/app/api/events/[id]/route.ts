import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const eventId = Number(resolvedParams.id)

    if (Number.isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event id' },
        { status: 400 }
      )
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    console.log('EVENT DETAIL:', event)

    return NextResponse.json(
      { event },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET EVENT DETAIL ERROR:', error)

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}