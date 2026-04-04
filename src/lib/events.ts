export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO string
  time: string
  location: string
  city: string
  categoryId: string
  image: string
  price: number
  organizer: string
  attendeesCount: number
  isFeatured: boolean
  tags: string[]
}

export const events: Event[] = [
  // TODO: Replace with API call - Fetching nearby events
  // {
  //   id: 'api_event_1',
  //   title: 'Event Title',
  //   description: 'Event description will be loaded from API',
  //   date: new Date().toISOString(),
  //   time: 'HH:MM AM/PM',
  //   location: 'Location',
  //   city: 'City',
  //   categoryId: 'category_id',
  //   image: 'https://api-image-url.com/image.jpg',
  //   price: 0,
  //   organizer: 'Organizer Name',
  //   attendeesCount: 0,
  //   isFeatured: false,
  //   tags: ['tag1', 'tag2'],
  // }
]
