import { caughtBreedIds, longestStreak } from '@/game/logic';
import type { GameState } from '@/state/types';

export type BadgeId = 'top-dog' | 'twenty-breeds' | 'seven-day-walk' | 'pack-leader';

export type Badge = { id: BadgeId; label: string; detail: string; earned: boolean };

export const PACK_LEADER_BREEDS = 25;

export function badges(s: GameState): Badge[] {
  const breeds = caughtBreedIds(s).size;
  return [
    { id: 'top-dog', label: 'Top Dog', detail: 'Win a daily Top Dog game', earned: s.topDogWins.length > 0 },
    { id: 'twenty-breeds', label: '20 breeds', detail: 'Catch 20 different breeds', earned: breeds >= 20 },
    { id: 'seven-day-walk', label: '7-day walk', detail: 'Catch a dog 7 days in a row', earned: longestStreak(s) >= 7 },
    {
      id: 'pack-leader',
      label: 'Pack Leader',
      detail: `Catch ${PACK_LEADER_BREEDS} different breeds`,
      earned: breeds >= PACK_LEADER_BREEDS,
    },
  ];
}

const MILESTONES: [number, string][] = [
  [1, 'First Catch'],
  [5, 'Pup Scout'],
  [10, 'Good Walker'],
  [20, '20 breeds'],
  [PACK_LEADER_BREEDS, 'Pack Leader'],
  [50, 'Dog Whisperer'],
  [100, 'Breed Master'],
  [120, 'Every Dog'],
];

/** The next breed-count milestone shown on the Breed Index header. */
export function nextMilestone(breeds: number): { at: number; label: string } | null {
  const m = MILESTONES.find(([at]) => at > breeds);
  return m ? { at: m[0], label: m[1] } : null;
}
