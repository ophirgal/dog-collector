import { useEffect, useMemo } from 'react';

import { addDays } from '@/game/dates';
import { recordWin } from '@/game/logic';
import { buildGame, standings, type Candidate } from '@/game/topDog';
import { useGame, useToday } from '@/state/store';
import type { GameState } from '@/state/types';

function entryFor(s: GameState, day: string): Candidate | undefined {
  const dog = s.dogs.find((d) => d.enteredDay === day);
  if (!dog) return undefined;
  return {
    id: dog.id,
    name: dog.name,
    breedId: dog.breedId,
    owner: s.username ?? 'you',
    neighborhood: dog.place?.neighborhood ?? 'Nearby',
    dogId: dog.id,
    photoUri: dog.photoUri,
  };
}

export function useTopDogGame(day: string) {
  const { state } = useGame();
  const entry = entryFor(state, day);
  // Rebuild only when the entered dog changes, not on every state change.
  const entryKey = entry ? `${entry.id}:${entry.name}:${entry.photoUri ?? ''}` : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const game = useMemo(() => buildGame(day, entry), [day, entryKey]);
  const votes = state.topDogVotes[day];
  return { game, votes };
}

/** Credits a Top Dog win when one of your dogs took yesterday's crown. */
export function useRecordTopDogWins() {
  const today = useToday();
  const yesterday = addDays(today, -1);
  const { update } = useGame();
  const { game, votes } = useTopDogGame(yesterday);
  const winner = standings(game, votes)[0]?.candidate;
  useEffect(() => {
    if (winner?.dogId) update((s) => recordWin(s, yesterday));
  }, [winner?.dogId, yesterday, update]);
}
