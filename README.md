# Dog Collector

Snap the real dogs you meet and build your pack. Every dog becomes a card with your photo, a name and the spot where you met. Fill a 120-breed index, collect favorites from the feed, and vote in a daily Top Dog game.

Built with Expo SDK 57 and Expo Router.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS or Android). Allow camera and location when asked. `npx expo start --web` also works for a quick look, with an illustrated map in place of the real one.

## Screens

| Route | Screen |
| --- | --- |
| `/welcome` | Pick a username (no email, no password) |
| `/map` | Recent sightings, hotspots, your catches and friends on a map, plus the live Top Dog round |
| `/snap` | Camera with a frame guide and a tip about asking owners first |
| `/caught` | New card: name the dog, pick the breed, add it to your pack |
| `/pack` | All, caught and collected dogs |
| `/breeds` | Breed Index by group, with silhouettes for breeds you haven't caught |
| `/dog/[id]` | Dog detail with the private exact spot, post to feed, send as sticker, enter Top Dog, release |
| `/feed` | Following, Nearby and World posts; vote, follow and collect |
| `/top-dog` | Today's game: 6 dogs, 5 rounds through the day, one crown |
| `/winner` | Yesterday's winner and final standings |
| `/profile` | Stats, daily gem pouch, badges, friends and privacy |
| `/plus` | Plus and gem packs |
| `/stickers` | Your dogs as stickers to share |

## Game rules

- The first catch of a breed is free. Catching another dog of a breed you already have costs 1 gem.
- Collecting a dog from the feed or the Top Dog winner costs 1 gem. Collected dogs don't count toward the Breed Index.
- You start with 3 gems and claim 1 free gem a day (3 with Plus).
- Top Dog splits the day into 5 rounds. Your own dog can be entered into tomorrow's game.
- Badges: Top Dog win, 20 breeds, 7-day walk streak, Pack Leader (25 breeds).

## What isn't real yet

- **No backend.** Everything is stored on the phone with AsyncStorage. The feed, sightings, friends and Top Dog crowd votes come from sample data in `src/data/community.ts`, placed deterministically so they stay put. Posting to the feed only shows on your own phone.
- **No breed recognition.** You pick the breed after snapping. On-device dog detection needs a model and a development build.
- **No purchases.** Plus and gem packs show a "not live yet" message. Development builds offer a "Grant for testing" button.
- **Stickers** share through the system share sheet. A real iMessage sticker pack needs a native extension.

## Code map

- `src/app/` routes (Expo Router). `(tabs)/` holds Map, Feed, Top Dog and My Pack with a custom tab bar and the center Snap button.
- `src/game/` pure game logic: gems and catches (`logic.ts`), Top Dog (`topDog.ts`), sightings (`sightings.ts`), badges. Covered by `npm test`.
- `src/state/store.tsx` app state in React context, persisted to AsyncStorage.
- `src/data/breeds.ts` the 120 breeds with parameters for the placeholder sticker art drawn in `src/components/DogArt.tsx`.
- `src/services/` camera photo storage, location and place names, sharing.

## Checks

```bash
npm run lint
npm run typecheck
npm test
```
