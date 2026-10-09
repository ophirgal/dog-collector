import { DEFAULT_FOLLOWING, type CommunityDog } from '@/data/community';
import { addDays, dayKey } from '@/game/dates';
import type { Dog, GameState, Result } from '@/state/types';

export const STARTING_GEMS = 3;
export const COLLECT_COST = 1;

export function initialState(now = Date.now()): GameState {
  return {
    version: 1,
    username: null,
    joinedAt: now,
    gems: STARTING_GEMS,
    plus: false,
    lastClaimDay: null,
    dogs: [],
    following: DEFAULT_FOLLOWING,
    liked: [],
    topDogVotes: {},
    topDogWins: [],
    privacy: 'neighborhood',
  };
}

export const gemsPerDay = (plus: boolean) => (plus ? 3 : 1);

export const canClaim = (s: GameState, today: string) => s.lastClaimDay !== today;

export function claimGems(s: GameState, today: string): Result {
  if (!canClaim(s, today)) return { ok: false, reason: 'already' };
  return { ok: true, state: { ...s, gems: s.gems + gemsPerDay(s.plus), lastClaimDay: today } };
}

/** Breeds you have photographed yourself. Collected dogs don't fill the index. */
export function caughtBreedIds(s: GameState): Set<string> {
  return new Set(s.dogs.filter((d) => d.source === 'caught').map((d) => d.breedId));
}

/** The first catch of a new breed is always free; repeat breeds cost a gem. */
export function catchCost(s: GameState, breedId: string): number {
  return caughtBreedIds(s).has(breedId) ? 1 : 0;
}

export function addCatch(s: GameState, dog: Dog): Result {
  const cost = catchCost(s, dog.breedId);
  if (s.gems < cost) return { ok: false, reason: 'no-gems' };
  return { ok: true, state: { ...s, gems: s.gems - cost, dogs: [dog, ...s.dogs] } };
}

export const hasCollected = (s: GameState, communityId: string) =>
  s.dogs.some((d) => d.communityId === communityId);

export function collect(s: GameState, c: CommunityDog, now = Date.now()): Result {
  if (hasCollected(s, c.id)) return { ok: false, reason: 'already' };
  if (s.gems < COLLECT_COST) return { ok: false, reason: 'no-gems' };
  const dog: Dog = {
    id: `${c.id}-${now}`,
    name: c.name,
    breedId: c.breedId,
    source: 'collected',
    communityId: c.id,
    from: c.owner,
    metAt: now,
  };
  return { ok: true, state: { ...s, gems: s.gems - COLLECT_COST, dogs: [dog, ...s.dogs] } };
}

export const updateDog = (s: GameState, id: string, patch: Partial<Dog>): GameState => ({
  ...s,
  dogs: s.dogs.map((d) => (d.id === id ? { ...d, ...patch } : d)),
});

export const releaseDog = (s: GameState, id: string): GameState => ({
  ...s,
  dogs: s.dogs.filter((d) => d.id !== id),
});

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export const toggleLike = (s: GameState, postId: string): GameState => ({ ...s, liked: toggle(s.liked, postId) });

export const toggleFollow = (s: GameState, user: string): GameState => ({
  ...s,
  following: toggle(s.following, user),
});

/** Entering Top Dog puts your dog in tomorrow's game. One dog per day. */
export function enterTopDog(s: GameState, dogId: string, today: string): GameState {
  const day = addDays(today, 1);
  return {
    ...s,
    dogs: s.dogs.map((d) =>
      d.id === dogId ? { ...d, enteredDay: day } : d.enteredDay === day ? { ...d, enteredDay: undefined } : d,
    ),
  };
}

export function vote(s: GameState, day: string, round: number, candidateId: string): GameState {
  const dayVotes = s.topDogVotes[day] ?? {};
  if (dayVotes[round]) return s;
  // Keep only the last few days of votes.
  const keep = new Set([day, addDays(day, -1), addDays(day, -2)]);
  const votes = Object.fromEntries(Object.entries(s.topDogVotes).filter(([k]) => keep.has(k)));
  return { ...s, topDogVotes: { ...votes, [day]: { ...dayVotes, [round]: candidateId } } };
}

export const recordWin = (s: GameState, day: string): GameState =>
  s.topDogWins.includes(day) ? s : { ...s, topDogWins: [...s.topDogWins, day] };

/** Longest run of consecutive days with at least one catch. */
export function longestStreak(s: GameState): number {
  const days = new Set(s.dogs.filter((d) => d.source === 'caught').map((d) => dayKey(new Date(d.metAt))));
  let best = 0;
  for (const d of days) {
    if (days.has(addDays(d, -1))) continue;
    let len = 1;
    while (days.has(addDays(d, len))) len++;
    best = Math.max(best, len);
  }
  return best;
}
