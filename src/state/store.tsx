import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { dayKey } from '@/game/dates';
import { initialState } from '@/game/logic';
import type { GameState, Result } from '@/state/types';

const STORAGE_KEY = 'dog-collector/state/v1';

type GameContext = {
  state: GameState;
  hydrated: boolean;
  /** Apply a change that always succeeds. */
  update: (fn: (s: GameState) => GameState) => void;
  /** Apply a change that can fail (not enough gems, already done). */
  attempt: (fn: (s: GameState) => Result) => Result;
  reset: () => void;
};

const Ctx = createContext<GameContext | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => initialState());
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef(state);

  const commit = useCallback((next: GameState) => {
    ref.current = next;
    setState(next);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<GameState>;
        if (saved.version === 1) commit({ ...initialState(), ...saved } as GameState);
      })
      .catch(() => {
        // Corrupt or unreadable save: start fresh rather than crash.
      })
      .finally(() => setHydrated(true));
  }, [commit]);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state, hydrated]);

  const update = useCallback((fn: (s: GameState) => GameState) => commit(fn(ref.current)), [commit]);
  const attempt = useCallback(
    (fn: (s: GameState) => Result) => {
      const r = fn(ref.current);
      if (r.ok) commit(r.state);
      return r;
    },
    [commit],
  );
  const reset = useCallback(() => commit(initialState()), [commit]);

  const value = useMemo<GameContext>(
    () => ({ state, hydrated, update, attempt, reset }),
    [state, hydrated, update, attempt, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}

/** Re-renders every `intervalMs` so countdowns and "x min ago" stay fresh. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export const useToday = () => dayKey(new Date(useNow(60_000)));
