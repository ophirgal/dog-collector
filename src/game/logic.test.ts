import { describe, expect, it } from '@jest/globals';

import { BREEDS, getBreed, MIXED_BREED_ID } from '@/data/breeds';
import { COMMUNITY_DOGS } from '@/data/community';
import { addDays } from '@/game/dates';
import {
  addCatch,
  canClaim,
  catchCost,
  caughtBreedIds,
  claimGems,
  collect,
  enterTopDog,
  initialState,
  longestStreak,
  STARTING_GEMS,
  vote,
} from '@/game/logic';
import { checkUsername } from '@/game/username';
import type { Dog, GameState } from '@/state/types';

const DAY = 24 * 3600 * 1000;
const dog = (id: string, breedId: string, metAt = Date.now()): Dog => ({ id, name: id, breedId, source: 'caught', metAt });

function must(r: ReturnType<typeof addCatch>): GameState {
  if (!r.ok) throw new Error(r.reason);
  return r.state;
}

describe('breeds', () => {
  it('has 120 unique breeds with sequential numbers', () => {
    expect(BREEDS).toHaveLength(120);
    expect(new Set(BREEDS.map((b) => b.id)).size).toBe(120);
    expect(BREEDS.map((b) => b.number)).toEqual(BREEDS.map((_, i) => i + 1));
  });

  it('falls back to mixed breed for unknown ids', () => {
    expect(getBreed('nope').id).toBe(MIXED_BREED_ID);
  });

  it('every community dog uses a real breed', () => {
    for (const d of COMMUNITY_DOGS) expect(getBreed(d.breedId).id).toBe(d.breedId);
  });
});

describe('gems', () => {
  it('first catch of a breed is free, repeats cost one gem', () => {
    let s = initialState();
    expect(catchCost(s, 'beagle')).toBe(0);
    s = must(addCatch(s, dog('a', 'beagle')));
    expect(s.gems).toBe(STARTING_GEMS);
    expect(catchCost(s, 'beagle')).toBe(1);
    s = must(addCatch(s, dog('b', 'beagle')));
    expect(s.gems).toBe(STARTING_GEMS - 1);
  });

  it('refuses a paid catch with no gems', () => {
    let s = { ...initialState(), gems: 0 };
    s = must(addCatch(s, dog('a', 'pug')));
    const r = addCatch(s, dog('b', 'pug'));
    expect(r).toEqual({ ok: false, reason: 'no-gems' });
  });

  it('claims once per day, three with Plus', () => {
    const s = initialState();
    const r = claimGems(s, '2026-10-09');
    expect(r.ok && r.state.gems).toBe(STARTING_GEMS + 1);
    if (!r.ok) return;
    expect(canClaim(r.state, '2026-10-09')).toBe(false);
    expect(claimGems(r.state, '2026-10-09').ok).toBe(false);
    const plus = claimGems({ ...s, plus: true }, '2026-10-09');
    expect(plus.ok && plus.state.gems).toBe(STARTING_GEMS + 3);
  });

  it('collecting costs a gem, once per post, and does not fill the index', () => {
    const c = COMMUNITY_DOGS[0];
    const s = must(collect(initialState(), c, 1));
    expect(s.gems).toBe(STARTING_GEMS - 1);
    expect(s.dogs[0]).toMatchObject({ source: 'collected', communityId: c.id, from: c.owner });
    expect(caughtBreedIds(s).size).toBe(0);
    expect(collect(s, c, 2)).toEqual({ ok: false, reason: 'already' });
  });
});

describe('top dog entries and votes', () => {
  it('enters one dog into tomorrow and replaces the previous entry', () => {
    let s = must(addCatch(initialState(), dog('a', 'pug')));
    s = must(addCatch(s, dog('b', 'beagle')));
    s = enterTopDog(s, 'a', '2026-10-09');
    s = enterTopDog(s, 'b', '2026-10-09');
    expect(s.dogs.find((d) => d.id === 'a')?.enteredDay).toBeUndefined();
    expect(s.dogs.find((d) => d.id === 'b')?.enteredDay).toBe('2026-10-10');
  });

  it('keeps the first vote in a round and drops old days', () => {
    let s = vote(initialState(), '2026-10-01', 0, 'x');
    s = vote(s, '2026-10-09', 0, 'a');
    s = vote(s, '2026-10-09', 0, 'b');
    expect(s.topDogVotes).toEqual({ '2026-10-09': { 0: 'a' } });
  });
});

describe('streaks and usernames', () => {
  it('finds the longest run of catch days', () => {
    const start = new Date(2026, 9, 1, 12).getTime();
    let s = initialState();
    for (const [i, d] of [0, 1, 2, 5, 6].entries()) s = must(addCatch(s, dog(`d${i}`, BREEDS[i].id, start + d * DAY)));
    expect(longestStreak(s)).toBe(3);
  });

  it('adds days across month ends', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('validates usernames', () => {
    expect(checkUsername('ophir_walks').ok).toBe(true);
    expect(checkUsername('ab').ok).toBe(false);
    expect(checkUsername('Has Space').ok).toBe(false);
    expect(checkUsername('maya.k')).toEqual({ ok: false, label: 'Taken' });
  });
});
