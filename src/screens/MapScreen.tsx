import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { DogBadge } from '../components/DogBadge';
import type { LatLng } from '../game/geo';
import {
  CATCH_RADIUS_M,
  SPAWN_WINDOW_MS,
  Spawn,
  inCatchRange,
  spawnWindow,
  spawnsNear,
  windowEndsAt,
} from '../game/spawns';
import { useCollection } from '../storage/collection';
import { CatchModal } from './CatchModal';

export function MapScreen() {
  const { caughtSpawnIds, addCatch } = useCollection();
  const [gpsPosition, setGpsPosition] = useState<LatLng | null>(null);
  const [fakePosition, setFakePosition] = useState<LatLng | null>(null);
  const [debug, setDebug] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [currentWindow, setCurrentWindow] = useState(() => spawnWindow(Date.now()));
  const [selected, setSelected] = useState<Spawn | null>(null);
  const mapRef = useRef<MapView>(null);

  const player = (debug && fakePosition) || gpsPosition;

  useEffect(() => {
    let sub: Location.LocationSubscription | undefined;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => setGpsPosition({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }),
      );
    })();
    return () => sub?.remove();
  }, []);

  // Roll over to the next set of dogs when the spawn window ends.
  useEffect(() => {
    const timer = setTimeout(
      () => setCurrentWindow(spawnWindow(Date.now())),
      windowEndsAt(currentWindow) - Date.now() + 500,
    );
    return () => clearTimeout(timer);
  }, [currentWindow]);

  // Recompute only when the player moves into a new ~10 m step, not on every GPS tick.
  const roundedKey = player
    ? `${player.latitude.toFixed(4)},${player.longitude.toFixed(4)}`
    : '';
  const spawns = useMemo(() => {
    if (!player) return [];
    const windowStart = currentWindow * SPAWN_WINDOW_MS;
    return spawnsNear(player, windowStart).filter((s) => !caughtSpawnIds.has(s.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundedKey, currentWindow, caughtSpawnIds]);

  useEffect(() => {
    if (player) mapRef.current?.animateCamera({ center: player }, { duration: 400 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundedKey]);

  if (permissionDenied) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Dog Collector needs your location to show dogs near you. Turn it on in Settings.
        </Text>
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Finding you…</Text>
      </View>
    );
  }

  const onDogPress = (spawn: Spawn) => {
    if (inCatchRange(player, spawn)) setSelected(spawn);
    else Alert.alert('Too far away', `Get within ${CATCH_RADIUS_M} m of ${spawn.name} to catch them.`);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialCamera={{ center: player, zoom: 17, pitch: 30, heading: 0, altitude: 600 }}
        showsUserLocation={!debug}
        showsPointsOfInterests={false}
        onLongPress={(e) => {
          if (debug) setFakePosition(e.nativeEvent.coordinate);
        }}
      >
        <Circle
          center={player}
          radius={CATCH_RADIUS_M}
          strokeColor="rgba(224,122,95,0.8)"
          fillColor="rgba(224,122,95,0.12)"
        />
        {debug && (
          <Marker coordinate={player} anchor={{ x: 0.5, y: 0.5 }}>
            <Text style={{ fontSize: 28 }}>🧍</Text>
          </Marker>
        )}
        {spawns.map((spawn) => {
          const near = inCatchRange(player, spawn);
          return (
            <Marker
              key={spawn.id}
              coordinate={spawn.position}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => onDogPress(spawn)}
              tracksViewChanges={false}
              opacity={near ? 1 : 0.55}
            >
              <DogBadge breed={spawn.breed} size={near ? 48 : 40} />
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.hud}>
        <Text style={styles.hudText}>
          {spawns.length} {spawns.length === 1 ? 'dog' : 'dogs'} nearby
        </Text>
      </View>

      <Pressable
        style={[styles.debugButton, debug && styles.debugOn]}
        onPress={() => {
          setDebug((d) => !d);
          setFakePosition(null);
        }}
      >
        <Text style={styles.debugText}>{debug ? 'Walk mode: long-press map' : 'Walk mode'}</Text>
      </Pressable>

      <CatchModal spawn={selected} onCatch={addCatch} onClose={() => setSelected(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  message: { fontSize: 16, textAlign: 'center', color: '#444' },
  hud: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hudText: { fontWeight: '700', color: '#333' },
  debugButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  debugOn: { backgroundColor: '#FFE8CC' },
  debugText: { fontSize: 12, color: '#333' },
});
