export type Place = {
  latitude: number;
  longitude: number;
  /** Shown to everyone, e.g. "Riverside". */
  neighborhood: string;
  /** Exact spot, only shown to you, e.g. "Corner of Elm & 4th". */
  spot: string;
};

export type DogSource = 'caught' | 'collected';

export type Dog = {
  id: string;
  name: string;
  breedId: string;
  /** caught = your own photo, collected = taken from someone else's post. */
  source: DogSource;
  photoUri?: string;
  communityId?: string;
  from?: string;
  metAt: number;
  place?: Place;
  postedAt?: number;
  /** Day key of the Top Dog game this dog is entered in. */
  enteredDay?: string;
};

export type Privacy = 'neighborhood' | 'hidden';

export type GameState = {
  version: 1;
  username: string | null;
  joinedAt: number;
  gems: number;
  plus: boolean;
  lastClaimDay: string | null;
  dogs: Dog[];
  following: string[];
  liked: string[];
  /** day -> round index -> candidate id */
  topDogVotes: Record<string, Record<number, string>>;
  /** Days on which one of your dogs won Top Dog. */
  topDogWins: string[];
  privacy: Privacy;
};

export type Result = { ok: true; state: GameState } | { ok: false; reason: 'no-gems' | 'already' };
