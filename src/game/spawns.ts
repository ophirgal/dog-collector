import { BREEDS, Breed, DOG_NAMES, RARITY_WEIGHT } from '../data/breeds';
import { LatLng, distanceMeters, metersToLatDegrees, metersToLonDegrees } from './geo';
import { hashString, mulberry32, pickWeighted } from './random';

// The world is cut into fixed grid cells of about 100 m, and time into
// 15 minute windows. Each (cell, window) pair seeds its own dogs, so the
// same dogs stay put while you walk and every player sees the same ones.
export const CELL_DEGREES = 0.001;
export const SPAWN_WINDOW_MS = 15 * 60 * 1000;
export const VISIBLE_RADIUS_M = 300;
export const CATCH_RADIUS_M = 40;

// How many dogs a cell holds: index is the count, value is its weight.
const COUNT_WEIGHTS = [35, 40, 18, 7];

export type Spawn = {
  id: string;
  breed: Breed;
  name: string;
  position: LatLng;
  window: number;
};

export function spawnWindow(nowMs: number): number {
  return Math.floor(nowMs / SPAWN_WINDOW_MS);
}

export function windowEndsAt(window: number): number {
  return (window + 1) * SPAWN_WINDOW_MS;
}

export function spawnsForCell(cellX: number, cellY: number, window: number): Spawn[] {
  const rand = mulberry32(hashString(`${window}:${cellX}:${cellY}`));
  const counts = COUNT_WEIGHTS.map((weight, count) => ({ weight, count }));
  const { count } = pickWeighted(rand, counts, (c) => c.weight);

  const spawns: Spawn[] = [];
  for (let i = 0; i < count; i++) {
    const breed = pickWeighted(rand, BREEDS, (b) => RARITY_WEIGHT[b.rarity]);
    const name = DOG_NAMES[Math.floor(rand() * DOG_NAMES.length)];
    spawns.push({
      id: `${window}:${cellX}:${cellY}:${i}`,
      breed,
      name,
      position: {
        latitude: (cellY + rand()) * CELL_DEGREES,
        longitude: (cellX + rand()) * CELL_DEGREES,
      },
      window,
    });
  }
  return spawns;
}

export function spawnsNear(center: LatLng, nowMs: number, radiusM = VISIBLE_RADIUS_M): Spawn[] {
  const window = spawnWindow(nowMs);
  const latSpan = metersToLatDegrees(radiusM);
  const lonSpan = metersToLonDegrees(radiusM, center.latitude);
  const minX = Math.floor((center.longitude - lonSpan) / CELL_DEGREES);
  const maxX = Math.floor((center.longitude + lonSpan) / CELL_DEGREES);
  const minY = Math.floor((center.latitude - latSpan) / CELL_DEGREES);
  const maxY = Math.floor((center.latitude + latSpan) / CELL_DEGREES);

  const result: Spawn[] = [];
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (const spawn of spawnsForCell(x, y, window)) {
        if (distanceMeters(center, spawn.position) <= radiusM) result.push(spawn);
      }
    }
  }
  return result;
}

export function inCatchRange(player: LatLng, spawn: Spawn): boolean {
  return distanceMeters(player, spawn.position) <= CATCH_RADIUS_M;
}
