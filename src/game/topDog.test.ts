import { describe, expect, it } from '@jest/globals';

import { buildGame, roundAt, roundSplit, ROUND_MS, ROUNDS, standings } from '@/game/topDog';
import { sightingsNear } from '@/game/sightings';

describe('top dog', () => {
  it('is the same game for everyone on a given day', () => {
    expect(buildGame('2026-10-09')).toEqual(buildGame('2026-10-09'));
    expect(buildGame('2026-10-09').candidates).not.toEqual(buildGame('2026-10-10').candidates);
  });

  it('has 6 distinct dogs and 5 rounds that use all of them', () => {
    const g = buildGame('2026-10-09');
    expect(new Set(g.candidates.map((c) => c.id)).size).toBe(6);
    expect(g.pairs).toHaveLength(ROUNDS);
    expect(new Set(g.pairs.flat()).size).toBe(6);
  });

  it('puts your entered dog in the game', () => {
    const mine = { id: 'd-1', name: 'Waffles', breedId: 'pembroke-welsh-corgi', owner: 'me', neighborhood: 'X', dogId: 'd-1' };
    const g = buildGame('2026-10-09', mine);
    expect(g.candidates).toContainEqual(mine);
  });

  it('your vote moves the result', () => {
    const g = buildGame('2026-10-09');
    const [a] = g.pairs[0];
    const before = roundSplit(g, 0)[0];
    const after = roundSplit(g, 0, { 0: g.candidates[a].id })[0];
    expect(after).toBeGreaterThan(before);
    const total = standings(g).reduce((n, s) => n + s.percent, 0);
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  it('splits the day into five rounds', () => {
    const start = new Date(2026, 9, 9);
    expect(roundAt(start, start.getTime()).round).toBe(0);
    expect(roundAt(start, start.getTime() + ROUND_MS * 2.5).round).toBe(2);
    expect(roundAt(start, start.getTime() + ROUND_MS * 5 - 1).round).toBe(4);
  });
});

describe('sightings', () => {
  it('are stable within a 15 minute window', () => {
    const c = { latitude: 40.78, longitude: -73.96 };
    const t = Date.UTC(2026, 9, 9, 12, 1);
    expect(sightingsNear(c, t).map((s) => s.id)).toEqual(sightingsNear(c, t + 60_000).map((s) => s.id));
  });
});
