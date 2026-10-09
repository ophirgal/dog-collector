import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { LatLng } from '@/game/sightings';
import type { Place } from '@/state/types';

/** Used when location is off, so the map still has somewhere to look. */
export const FALLBACK_CENTER: LatLng = { latitude: 40.7812, longitude: -73.9665 };

export async function ensureLocationPermission(): Promise<boolean> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Location.requestForegroundPermissionsAsync()).granted;
}

export async function describePlace(coords: LatLng): Promise<Place> {
  let neighborhood = 'Nearby';
  let spot = 'Where you met';
  try {
    const [a] = await Location.reverseGeocodeAsync(coords);
    if (a) {
      neighborhood = a.district ?? a.subregion ?? a.city ?? neighborhood;
      spot = a.street ? (a.streetNumber ? `${a.streetNumber} ${a.street}` : a.street) : (a.name ?? spot);
    }
  } catch {
    // Reverse geocoding isn't available everywhere (web, no network). Keep the defaults.
  }
  return { ...coords, neighborhood, spot };
}

/** Where you are right now, with a place name, or undefined if location is off. */
export async function currentPlace(): Promise<Place | undefined> {
  try {
    if (!(await ensureLocationPermission())) return undefined;
    const pos =
      (await Location.getLastKnownPositionAsync({ maxAge: 60_000 })) ??
      (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    return describePlace({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
  } catch {
    return undefined;
  }
}

/** Follows your position while the screen is mounted. */
export function useUserLocation() {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let sub: Location.LocationSubscription | undefined;
    let cancelled = false;
    (async () => {
      try {
        if (!(await ensureLocationPermission())) {
          if (!cancelled) setDenied(true);
          return;
        }
        sub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, distanceInterval: 15 },
          (p) => setCoords({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
        );
        if (cancelled) sub.remove();
      } catch {
        if (!cancelled) setDenied(true);
      }
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  return { coords, denied };
}
