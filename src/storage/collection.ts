import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Spawn } from '../game/spawns';

const STORAGE_KEY = 'dog-collector/catches/v1';

export type Catch = {
  spawnId: string;
  breedId: string;
  name: string;
  caughtAt: number;
  latitude: number;
  longitude: number;
};

export type Collection = {
  loaded: boolean;
  catches: Catch[];
  caughtSpawnIds: Set<string>;
  addCatch: (spawn: Spawn) => void;
};

export const CollectionContext = createContext<Collection | null>(null);

export function useCollectionState(): Collection {
  const [loaded, setLoaded] = useState(false);
  const [catches, setCatches] = useState<Catch[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setCatches(JSON.parse(raw));
      })
      .catch((err) => console.warn('Could not load collection', err))
      .finally(() => setLoaded(true));
  }, []);

  const addCatch = useCallback((spawn: Spawn) => {
    setCatches((prev) => {
      if (prev.some((c) => c.spawnId === spawn.id)) return prev;
      const next = [
        ...prev,
        {
          spawnId: spawn.id,
          breedId: spawn.breed.id,
          name: spawn.name,
          caughtAt: Date.now(),
          latitude: spawn.position.latitude,
          longitude: spawn.position.longitude,
        },
      ];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((err) =>
        console.warn('Could not save collection', err),
      );
      return next;
    });
  }, []);

  const caughtSpawnIds = useMemo(() => new Set(catches.map((c) => c.spawnId)), [catches]);

  return { loaded, catches, caughtSpawnIds, addCatch };
}

export function useCollection(): Collection {
  const value = useContext(CollectionContext);
  if (!value) throw new Error('useCollection must be used inside CollectionContext');
  return value;
}
