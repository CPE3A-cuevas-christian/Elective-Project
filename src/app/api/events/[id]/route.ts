import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token) as { id: number }

    if (!payload?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const resolvedParams = await params
    const eventId = Number(resolvedParams.id)

    if (Number.isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event id' },
        { status: 400 }
      )
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.organizerId !== payload.id) {
      return NextResponse.json(
        { error: 'You can only edit your own events' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, description, category, location, date, time } = body

    if (!name || !description || !category || !location || !date || !time) {
      return NextResponse.json(
        { error: 'Please fill in all fields.' },
        { status: 400 },
      )
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        category,
        location,
        date,
        time,
      },
    })

    return NextResponse.json({ event: updatedEvent }, { status: 200 })
  } catch (error) {
    console.error('UPDATE EVENT ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value
    console.log('DELETE - Token exists:', !!token)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token) as { id: number }
    console.log('DELETE - Payload:', payload)

    if (!payload?.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const resolvedParams = await params
    const eventId = Number(resolvedParams.id)
    console.log('DELETE - Event ID:', eventId)

    if (Number.isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event id' },
        { status: 400 }
      )
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })
    console.log('DELETE - Found event:', event)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    console.log('DELETE - Checking ownership:', event.organizerId, 'vs', payload.id)
    if (event.organizerId !== payload.id) {
      return NextResponse.json(
        { error: 'You can only delete your own events' },
        { status: 403 }
      )
    }

    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    })
    console.log('DELETE - Event deleted:', deletedEvent)

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('DELETE EVENT ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}