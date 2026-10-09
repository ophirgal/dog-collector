# Dog Collector

A Pokemon Go style game about dogs. This is the first playable prototype: a map that follows you, dogs that spawn nearby, tap to catch when you're close, and a collection screen that fills a breed index.

## Play it on your phone

1. Install **Expo Go** from the App Store or Google Play.
2. On your computer: `npm install`, then `npx expo start`.
3. Scan the QR code (Camera app on iPhone, Expo Go on Android) and allow location.

Testing at a desk: tap **Walk mode** on the map, then long-press anywhere to move yourself there.

## How it works

- `src/game/spawns.ts` cuts the world into ~100 m cells and time into 15 minute windows. Each cell and window seeds 0 to 3 dogs, so they stay put while you walk and every player sees the same ones. Breeds are weighted by rarity.
- You can see dogs within 300 m and catch ones within 40 m.
- `src/data/breeds.ts` holds the 20 breeds in the index, with placeholder emoji art.
- Catches are saved on the phone with AsyncStorage. There is no server or account yet.

## Scripts

- `npm test` runs the spawn generator tests.
- `npm run lint` and `npm run typecheck`.

## Not in this prototype

Snapping real dogs with the camera, breed recognition, the feed, gems, the daily Top Dog game and accounts. See the plan doc for what comes next.
