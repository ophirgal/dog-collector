import { describe, expect, it } from '@jest/globals';
import { BREEDS } from '../data/breeds';
import { distanceMeters } from './geo';
import { CELL_DEGREES, SPAWN_WINDOW_MS, spawnsForCell, spawnsNear, spawnWindow } from './spawns';

const montreal = { latitude: 45.5432, longitude: -73.6145 };
const now = Date.UTC(2026, 9, 9, 15, 0, 0);

describe('spawns', () => {
  it('gives the same dogs for the same cell and window', () => {
    expect(spawnsForCell(-73615, 45543, 100)).toEqual(spawnsForCell(-73615, 45543, 100));
  });

  it('gives the same nearby dogs anywhere inside one window', () => {
    const later = now + 60_000;
    expect(spawnWindow(later)).toBe(spawnWindow(now));
    expect(spawnsNear(montreal, later)).toEqual(spawnsNear(montreal, now));
  });

  it('changes dogs when the window rolls over', () => {
    const next = spawnsNear(montreal, now + SPAWN_WINDOW_MS).map((s) => s.id);
    const current = spawnsNear(montreal, now).map((s) => s.id);
    expect(next).not.toEqual(current);
  });

  it('keeps each dog inside its own cell', () => {
    for (let x = 0; x < 50; x++) {
      for (const s of spawnsForCell(x, 1000, 7)) {
        expect(Math.floor(s.position.longitude / CELL_DEGREES)).toBe(x);
        expect(Math.floor(s.position.latitude / CELL_DEGREES)).toBe(1000);
      }
    }
  });

  it('only returns dogs within the radius', () => {
    const spawns = spawnsNear(montreal, now, 300);
    expect(spawns.length).toBeGreaterThan(0);
    for (const s of spawns) expect(distanceMeters(montreal, s.position)).toBeLessThanOrEqual(300);
  });

  it('spawns rare breeds less often than common ones', () => {
    const counts = { common: 0, uncommon: 0, rare: 0 };
    for (let x = 0; x < 3000; x++) for (const s of spawnsForCell(x, 0, 1)) counts[s.breed.rarity]++;
    expect(counts.common).toBeGreaterThan(counts.uncommon);
    expect(counts.uncommon).toBeGreaterThan(counts.rare);
    expect(counts.rare).toBeGreaterThan(0);
  });

  it('can eventually spawn every breed', () => {
    const seen = new Set<string>();
    for (let x = 0; x < 5000; x++) for (const s of spawnsForCell(x, 0, 2)) seen.add(s.breed.id);
    expect(seen.size).toBe(BREEDS.length);
  });
});
