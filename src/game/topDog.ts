import { COMMUNITY_DOGS } from '@/data/community';
import { hashString, mulberry32, seededShuffle } from '@/game/random';

export const ROUNDS = 5;
export const CANDIDATES = 6;
const DAY_MS = 24 * 60 * 60 * 1000;
export const ROUND_MS = DAY_MS / ROUNDS;
/** How much one of your votes moves a dog's score. The crowd is simulated until there is a server. */
const USER_VOTE_WEIGHT = 0.25;

const THEMES = [
  { title: 'Best ears', question: 'Who has the better ears?' },
  { title: 'Best smile', question: 'Who has the better smile?' },
  { title: 'Fluffiest', question: 'Who is fluffier?' },
  { title: 'Most dramatic', question: 'Who is more dramatic?' },
  { title: 'Best nap face', question: 'Who naps better?' },
  { title: 'Goodest dog', question: 'Who is the goodest?' },
  { title: 'Best zoomies', question: 'Who has better zoomies?' },
];

export type Candidate = {
  id: string;
  name: string;
  breedId: string;
  owner: string;
  neighborhood: string;
  /** Set when the candidate is one of your own dogs. */
  dogId?: string;
  photoUri?: string;
};

export type TopDogGame = {
  day: string;
  theme: { title: string; question: string };
  candidates: Candidate[];
  /** Index pairs into candidates, one per round. */
  pairs: [number, number][];
  weights: number[];
};

export function buildGame(day: string, entry?: Candidate): TopDogGame {
  const rand = mulberry32(hashString(`topdog:${day}`));
  const theme = THEMES[Math.floor(rand() * THEMES.length)];
  const candidates: Candidate[] = seededShuffle(COMMUNITY_DOGS, rand)
    .slice(0, CANDIDATES)
    .map((d) => ({ id: d.id, name: d.name, breedId: d.breedId, owner: d.owner, neighborhood: d.neighborhood }));
  const weights = candidates.map(() => 0.6 + rand() * 0.9);
  if (entry) {
    candidates[CANDIDATES - 1] = entry;
    // Your own dog gets a small home-crowd boost, so entering is worth it.
    weights[CANDIDATES - 1] = 0.9 + rand() * 0.7;
  }
  const o = seededShuffle([0, 1, 2, 3, 4, 5], rand);
  const pairs: [number, number][] = [
    [o[0], o[1]],
    [o[2], o[3]],
    [o[4], o[5]],
    [o[0], o[3]],
    [o[1], o[4]],
  ];
  return { day, theme, candidates, pairs, weights };
}

export function roundAt(dayStart: Date, now: number): { round: number; endsInMs: number } {
  const elapsed = Math.max(0, now - dayStart.getTime());
  const round = Math.min(ROUNDS - 1, Math.floor(elapsed / ROUND_MS));
  return { round, endsInMs: (round + 1) * ROUND_MS - elapsed };
}

function scores(game: TopDogGame, votes: Record<number, string> = {}): number[] {
  const w = game.weights.slice();
  for (const id of Object.values(votes)) {
    const i = game.candidates.findIndex((c) => c.id === id);
    if (i >= 0) w[i] += USER_VOTE_WEIGHT;
  }
  return w;
}

/** Share of the vote for each side of a round, as whole percents. */
export function roundSplit(game: TopDogGame, round: number, votes?: Record<number, string>): [number, number] {
  const w = scores(game, votes);
  const [a, b] = game.pairs[round];
  const pa = Math.round((w[a] / (w[a] + w[b])) * 100);
  return [pa, 100 - pa];
}

export type Standing = { candidate: Candidate; percent: number };

export function standings(game: TopDogGame, votes?: Record<number, string>): Standing[] {
  const w = scores(game, votes);
  const total = w.reduce((a, b) => a + b, 0);
  return game.candidates
    .map((candidate, i) => ({ candidate, percent: Math.round((w[i] / total) * 100) }))
    .sort((x, y) => y.percent - x.percent);
}
