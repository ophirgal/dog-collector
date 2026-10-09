import { COMMUNITY_DOGS, type CommunityDog } from '@/data/community';
import { hashString, mulberry32, seededShuffle } from '@/game/random';

export type LatLng = { latitude: number; longitude: number };

export type Sighting = LatLng & {
  id: string;
  dog: CommunityDog;
  minutesAgo: number;
};

export type Hotspot = LatLng & { id: string; radius: number; count: number };

const WINDOW_MS = 15 * 60 * 1000;
const M_PER_DEG_LAT = 111_320;

export function offset(origin: LatLng, northM: number, eastM: number): LatLng {
  return {
    latitude: origin.latitude + northM / M_PER_DEG_LAT,
    longitude: origin.longitude + eastM / (M_PER_DEG_LAT * Math.cos((origin.latitude * Math.PI) / 180)),
  };
}

export function distanceM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Snap to a ~500 m grid so sightings don't jump around as you walk. */
const anchor = (p: LatLng): LatLng => ({
  latitude: Math.round(p.latitude * 200) / 200,
  longitude: Math.round(p.longitude * 200) / 200,
});

/**
 * Recent sightings around a point. Until there is a server these are sample
 * catches from the community, placed deterministically per 15-minute window.
 */
export function sightingsNear(center: LatLng, now = Date.now(), count = 8): Sighting[] {
  const a = anchor(center);
  const window = Math.floor(now / WINDOW_MS);
  const rand = mulberry32(hashString(`sight:${a.latitude}:${a.longitude}:${window}`));
  const sinceWindow = (now % WINDOW_MS) / 60000;
  return seededShuffle(COMMUNITY_DOGS, rand)
    .slice(0, count)
    .map((dog, i) => {
      const angle = rand() * Math.PI * 2;
      const dist = 80 + rand() * 520;
      const ago = Math.round(sinceWindow + [6, 12, 25, 40, 75, 120, 180, 240][i % 8] * (0.8 + rand() * 0.4));
      return {
        id: `${dog.id}-${window}`,
        dog,
        minutesAgo: ago,
        ...offset(center, Math.sin(angle) * dist, Math.cos(angle) * dist),
      };
    })
    .sort((x, y) => x.minutesAgo - y.minutesAgo);
}

export function hotspotsNear(center: LatLng): Hotspot[] {
  const a = anchor(center);
  const rand = mulberry32(hashString(`hot:${a.latitude}:${a.longitude}`));
  return [0, 1, 2].map((i) => {
    const angle = rand() * Math.PI * 2;
    const dist = 150 + rand() * 450;
    return {
      id: `hot-${i}`,
      radius: 90 + Math.round(rand() * 80),
      count: 4 + Math.floor(rand() * 18),
      ...offset(center, Math.sin(angle) * dist, Math.cos(angle) * dist),
    };
  });
}

export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
}
