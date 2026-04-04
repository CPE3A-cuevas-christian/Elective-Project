export interface Category {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

export const categories: Category[] = [
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🎪',
    color: 'bg-gold',
    description: 'description',
  },
  {
    id: 'music',
    name: 'Concerts',
    icon: '🎵',
    color: 'bg-sky',
    description: 'description',
  },
  {
    id: 'markets',
    name: 'Markets',
    icon: '🧺',
    color: 'bg-light-brown',
    description: 'description',
  },
  {
    id: 'workshops',
    name: 'Workshops',
    icon: '🔨',
    color: 'bg-brown',
    description: 'description',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    color: 'bg-green',
    description: 'description',
  },
  {
    id: 'community',
    name: 'Community',
    icon: '🤝',
    color: 'bg-dark-green',
    description: 'description',
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍲',
    color: 'bg-orange-400',
    description: 'description',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    color: 'bg-emerald-500',
    description: 'description',
  },
]
