export type Rarity = 'common' | 'uncommon' | 'rare';

export type Breed = {
  id: string;
  name: string;
  rarity: Rarity;
  // Placeholder art until we have real illustrations.
  emoji: string;
  color: string;
};

export const RARITY_WEIGHT: Record<Rarity, number> = {
  common: 60,
  uncommon: 30,
  rare: 10,
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
};

export const BREEDS: Breed[] = [
  { id: 'labrador', name: 'Labrador Retriever', rarity: 'common', emoji: '🦮', color: '#E8C872' },
  { id: 'golden', name: 'Golden Retriever', rarity: 'common', emoji: '🐕', color: '#E0A84C' },
  { id: 'german-shepherd', name: 'German Shepherd', rarity: 'common', emoji: '🐕‍🦺', color: '#8B5E34' },
  { id: 'beagle', name: 'Beagle', rarity: 'common', emoji: '🐶', color: '#C98B4E' },
  { id: 'french-bulldog', name: 'French Bulldog', rarity: 'common', emoji: '🐶', color: '#B7A99A' },
  { id: 'poodle', name: 'Poodle', rarity: 'common', emoji: '🐩', color: '#F2E6D8' },
  { id: 'chihuahua', name: 'Chihuahua', rarity: 'common', emoji: '🐶', color: '#E9B98A' },
  { id: 'mixed', name: 'Mixed Breed', rarity: 'common', emoji: '🐕', color: '#A3B18A' },
  { id: 'dachshund', name: 'Dachshund', rarity: 'uncommon', emoji: '🌭', color: '#9C5B2E' },
  { id: 'corgi', name: 'Corgi', rarity: 'uncommon', emoji: '🐶', color: '#F4A259' },
  { id: 'husky', name: 'Siberian Husky', rarity: 'uncommon', emoji: '🐺', color: '#9AA5B1' },
  { id: 'border-collie', name: 'Border Collie', rarity: 'uncommon', emoji: '🐕', color: '#3D405B' },
  { id: 'pug', name: 'Pug', rarity: 'uncommon', emoji: '🐶', color: '#D4B483' },
  { id: 'shiba', name: 'Shiba Inu', rarity: 'uncommon', emoji: '🦊', color: '#E07A5F' },
  { id: 'dalmatian', name: 'Dalmatian', rarity: 'uncommon', emoji: '🐕', color: '#DDDDDD' },
  { id: 'bernese', name: 'Bernese Mountain Dog', rarity: 'rare', emoji: '🏔️', color: '#5C4033' },
  { id: 'greyhound', name: 'Greyhound', rarity: 'rare', emoji: '💨', color: '#8D99AE' },
  { id: 'samoyed', name: 'Samoyed', rarity: 'rare', emoji: '☁️', color: '#F8F9FA' },
  { id: 'great-dane', name: 'Great Dane', rarity: 'rare', emoji: '🐕', color: '#4A4E69' },
  { id: 'akita', name: 'Akita', rarity: 'rare', emoji: '🐶', color: '#C8553D' },
];

export const BREEDS_BY_ID: Record<string, Breed> = Object.fromEntries(
  BREEDS.map((b) => [b.id, b]),
);

export const DOG_NAMES = [
  'Biscuit', 'Luna', 'Max', 'Bella', 'Charlie', 'Daisy', 'Milo', 'Rosie',
  'Cooper', 'Pepper', 'Teddy', 'Olive', 'Bear', 'Maple', 'Ziggy', 'Nala',
  'Rocket', 'Waffles', 'Pickle', 'Juniper', 'Scout', 'Hazel', 'Otis', 'Peanut',
];
