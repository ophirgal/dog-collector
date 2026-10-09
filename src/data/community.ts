/**
 * Sample community content. There is no backend yet, so the feed, sightings,
 * friends and the daily Top Dog game are seeded from these dogs. Replace this
 * module with API calls once a server exists (see services/community.ts).
 */
export type CommunityDog = {
  id: string;
  name: string;
  breedId: string;
  owner: string;
  neighborhood: string;
  caption: string;
  likes: number;
  hoursAgo: number;
  nearby: boolean;
};

const rows: [string, string, string, string, string, number, number, boolean][] = [
  ['Juno', 'siberian-husky', 'maya.k', 'Riverside', 'Talks back. Constantly.', 1240, 2, true],
  ['Gizmo', 'french-bulldog', 'lena.p', 'Old Town', 'Snores louder than my dad.', 860, 3, true],
  ['Meatball', 'pug', 'tomasz', 'Harbor Hill', 'Sat on my foot and refused to leave.', 2210, 5, false],
  ['Domino', 'dalmatian', 'dan_on_foot', 'Old Town', 'Counted 41 spots, lost count.', 530, 5, true],
  ['Pepper', 'border-collie', 'priya_walks', 'Maple Park', 'Herded three toddlers and a pigeon.', 712, 6, true],
  ['Noodle', 'labradoodle', 'jo.b', 'Riverside', 'A cloud with legs.', 401, 7, true],
  ['Miso', 'shiba-inu', 'kenji', 'Eastgate', 'Refused the photo. Then posed.', 1580, 8, false],
  ['Frank', 'dachshund', 'rosa.m', 'Harbor Hill', 'Long boy, short patience.', 640, 9, false],
  ['Rusty', 'mixed-breed', 'dan_on_foot', 'Maple Park', 'Shelter graduate, class of 2024.', 980, 10, true],
  ['Biscuit', 'golden-retriever', 'maya.k', 'Riverside', 'Brought me a stick as a toll.', 1720, 11, true],
  ['Bean', 'chihuahua', 'lena.p', 'Old Town', 'Four pounds of opinions.', 390, 12, true],
  ['Atlas', 'bernese-mountain-dog', 'oskar', 'Northfield', 'Built for snow, living in July.', 1105, 13, false],
  ['Luna', 'australian-shepherd', 'priya_walks', 'Maple Park', 'One blue eye, one brown, zero chill.', 1330, 14, true],
  ['Tofu', 'samoyed', 'kenji', 'Eastgate', 'Smiles for free.', 1890, 15, false],
  ['Olive', 'beagle', 'jo.b', 'Riverside', 'Followed her nose into a bakery.', 450, 16, true],
  ['Captain', 'boxer', 'oskar', 'Northfield', 'Wiggles with his whole body.', 670, 18, false],
  ['Pancake', 'cavalier-king-charles-spaniel', 'rosa.m', 'Harbor Hill', 'Ears like a judge’s wig.', 920, 19, false],
  ['Waffles', 'pembroke-welsh-corgi', 'tomasz', 'Harbor Hill', 'Loaf mode activated.', 1460, 20, false],
  ['Ziggy', 'jack-russell-terrier', 'sam', 'Old Town', 'Has not stopped moving since 2021.', 310, 22, true],
  ['Mochi', 'pomeranian', 'sam', 'Old Town', 'Mostly fluff, partly dog.', 760, 23, true],
  ['Bruno', 'rottweiler', 'oskar', 'Northfield', 'Gentle giant, scared of cats.', 580, 26, false],
  ['Hazel', 'cocker-spaniel', 'maya.k', 'Riverside', 'Ears dipped in her water bowl again.', 470, 28, true],
  ['Ghost', 'great-pyrenees', 'ines', 'Hillcrest', 'Thinks he is a lap dog.', 1210, 30, false],
  ['Ruby', 'vizsla', 'ines', 'Hillcrest', 'Velcro dog. Will not unstick.', 520, 31, false],
  ['Taco', 'miniature-schnauzer', 'jo.b', 'Riverside', 'Mustache game unmatched.', 680, 33, true],
  ['Kiwi', 'cockapoo', 'priya_walks', 'Maple Park', 'Professional puddle finder.', 340, 35, true],
  ['Duke', 'great-dane', 'tomasz', 'Harbor Hill', 'Pony-sized, mouse-hearted.', 1990, 37, false],
  ['Nori', 'boston-terrier', 'kenji', 'Eastgate', 'Tuxedo on, ready for gala.', 610, 40, false],
  ['Peanut', 'yorkshire-terrier', 'rosa.m', 'Harbor Hill', 'Wears a bow better than me.', 430, 44, false],
  ['Bear', 'newfoundland', 'ines', 'Hillcrest', 'Drool radius: three meters.', 870, 47, false],
];

export const COMMUNITY_DOGS: CommunityDog[] = rows.map(
  ([name, breedId, owner, neighborhood, caption, likes, hoursAgo, nearby]) => ({
    id: `c-${name.toLowerCase()}`,
    name,
    breedId,
    owner,
    neighborhood,
    caption,
    likes,
    hoursAgo,
    nearby,
  }),
);

export const COLLECTORS = Array.from(new Set(COMMUNITY_DOGS.map((d) => d.owner)));

export const DEFAULT_FOLLOWING = ['maya.k', 'dan_on_foot', 'priya_walks'];

export const getCommunityDog = (id: string) => COMMUNITY_DOGS.find((d) => d.id === id);

/** Pet names offered as a default when you catch a dog whose name you don't know. */
export const NAME_IDEAS = [
  'Biscuit', 'Waffles', 'Pickle', 'Maple', 'Sunny', 'Pretzel', 'Clover', 'Nugget', 'Scout',
  'Pepper', 'Dumpling', 'Ziggy', 'Bagel', 'Honey', 'Rocket', 'Toast', 'Juniper', 'Moose',
];
