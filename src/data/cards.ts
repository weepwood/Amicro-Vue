export type CardInteractionType =
  | 'arc-5' | 'arc-7' | 'long-arc' | 'linear' | 'corner-fan' | 'stamp-arc'
  | 'cascade' | 'scatter' | 'wheel' | 'carousel' | 'coverflow' | 'time-machine'

export interface CardConfig {
  id: string
  label: string
  interactionType: CardInteractionType
  description: string
  category: 'spreads' | 'carousels'
}

export const cardsData: CardConfig[] = [
  { id: 'c1', label: 'ARC (5 Cards)', interactionType: 'arc-5', description: 'A five-card spring arc driven by distance from the centre card.', category: 'spreads' },
  { id: 'c2', label: 'ARC (7 Cards)', interactionType: 'arc-7', description: 'A wider seven-card fan with transform-only layout changes.', category: 'spreads' },
  { id: 'c3', label: 'Long ARC', interactionType: 'long-arc', description: 'A wide sweeping arc with increased horizontal travel.', category: 'spreads' },
  { id: 'c4', label: 'Linear Spread', interactionType: 'linear', description: 'Cards spread horizontally without rotation.', category: 'spreads' },
  { id: 'c5', label: 'Corner Fan', interactionType: 'corner-fan', description: 'Cards fan from a shared bottom-left transform origin.', category: 'spreads' },
  { id: 'c6', label: 'Stamp Arc', interactionType: 'stamp-arc', description: 'Perforated cards fan into an adjustable arc.', category: 'spreads' },
  { id: 'c7', label: 'Cascade Stagger', interactionType: 'cascade', description: 'A diagonal cascade using staggered spring delays.', category: 'spreads' },
  { id: 'c8', label: 'Scatter Desk Deal', interactionType: 'scatter', description: 'A playful dealt-hand arrangement with varied rotations.', category: 'spreads' },
  { id: 'c9', label: 'Wheel Radial Fan', interactionType: 'wheel', description: 'Cards rotate around a bottom-centre radial origin.', category: 'spreads' },
  { id: 'c10', label: 'Interactive Carousel', interactionType: 'carousel', description: 'A compact 3D carousel with spring navigation.', category: 'carousels' },
  { id: 'c11', label: 'CoverFlow Carousel', interactionType: 'coverflow', description: 'Perspective cards flow along the z-axis.', category: 'carousels' },
  { id: 'c12', label: 'Time Machine Stack', interactionType: 'time-machine', description: 'A depth stack inspired by Apple-style timeline cards.', category: 'carousels' },
]
