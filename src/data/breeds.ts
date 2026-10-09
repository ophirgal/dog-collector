export type Rarity = 'common' | 'uncommon' | 'rare';

export type BreedGroup =
  | 'Herding'
  | 'Sporting'
  | 'Hound'
  | 'Working'
  | 'Terrier'
  | 'Toy'
  | 'Non-Sporting'
  | 'Mixed';

export type EarShape = 'floppy' | 'pointy' | 'bunny' | 'small';
export type Pattern = 'none' | 'blaze' | 'mask' | 'spots' | 'eye' | 'saddle' | 'cap';

/** Parameters for the cartoon sticker art in components/DogArt. */
export type DogLook = {
  coat: string;
  light: string;
  ear: EarShape;
  ears?: string;
  pattern?: Pattern;
  patch?: string;
  blueEyes?: boolean;
  tongue?: boolean;
};

export type Breed = {
  id: string;
  number: number;
  name: string;
  group: BreedGroup;
  rarity: Rarity;
  look: DogLook;
};

const L = {
  gold: { coat: '#E0A94A', light: '#F7E0B5', ear: 'floppy', ears: '#CF9235', tongue: true },
  corgi: { coat: '#E8873A', light: '#FFF4E6', ear: 'pointy', pattern: 'blaze' },
  shiba: { coat: '#E0823A', light: '#FFF4E6', ear: 'pointy' },
  borderCollie: { coat: '#2A2A2E', light: '#FFFFFF', ear: 'small', pattern: 'blaze' },
  merle: { coat: '#8E99A6', light: '#FFFFFF', ear: 'small', pattern: 'eye', patch: '#3E434B', blueEyes: true },
  gsd: { coat: '#B9783A', light: '#E9C99A', ear: 'pointy', pattern: 'cap', patch: '#2A2A2E' },
  sable: { coat: '#C07A3A', light: '#FFFFFF', ear: 'small', pattern: 'blaze' },
  shaggy: { coat: '#B9BEC6', light: '#FFFFFF', ear: 'floppy', ears: '#8E949D' },
  blackShaggy: { coat: '#2F3036', light: '#4A4B52', ear: 'floppy' },
  blueHeeler: { coat: '#6F7F93', light: '#D9DEE5', ear: 'pointy', pattern: 'eye', patch: '#3A3F48' },
  spitzCream: { coat: '#E9D1A6', light: '#FFF8EC', ear: 'pointy' },
  blackLab: { coat: '#2B2B30', light: '#3F3F46', ear: 'floppy', tongue: true },
  liverWhite: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'floppy', ears: '#7A3E1E', pattern: 'spots', patch: '#7A3E1E' },
  liver: { coat: '#7A3E1E', light: '#A56A44', ear: 'floppy' },
  rust: { coat: '#C3662E', light: '#E3A070', ear: 'floppy' },
  greyFloppy: { coat: '#8D939B', light: '#BFC4CA', ear: 'floppy' },
  orangeWhite: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'floppy', ears: '#D9782E', pattern: 'eye', patch: '#D9782E' },
  redSetter: { coat: '#A8461F', light: '#C9693B', ear: 'floppy' },
  whiteSpots: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'floppy', ears: '#3A3A40', pattern: 'spots', patch: '#3A3A40' },
  choc: { coat: '#5E3219', light: '#7C4A2C', ear: 'floppy' },
  black: { coat: '#2A2A2E', light: '#45454C', ear: 'floppy' },
  creamCurly: { coat: '#E8D7B8', light: '#F7EEDC', ear: 'floppy', ears: '#D7C09A' },
  beagle: { coat: '#B5682E', light: '#FFFFFF', ear: 'floppy', ears: '#6B3A1E', pattern: 'blaze', tongue: true },
  doxie: { coat: '#8B4A22', light: '#C98A5A', ear: 'floppy', ears: '#6B3518', tongue: true },
  grey: { coat: '#9AA1AA', light: '#E6E8EB', ear: 'small' },
  fawn: { coat: '#D8B98A', light: '#F3E6D0', ear: 'small' },
  fawnMask: { coat: '#DCC59A', light: '#F5EAD3', ear: 'small', ears: '#2E2A28', pattern: 'mask', patch: '#2E2A28' },
  wheat: { coat: '#CF9A5E', light: '#EBCDA4', ear: 'floppy' },
  basenji: { coat: '#C8743A', light: '#FFFFFF', ear: 'pointy', pattern: 'blaze' },
  cream: { coat: '#EADCC2', light: '#FBF5EA', ear: 'floppy', ears: '#DCC9A6' },
  blackTan: { coat: '#2A2A2E', light: '#B8743A', ear: 'floppy' },
  white: { coat: '#FFFFFF', light: '#F3F0EA', ear: 'floppy', ears: '#EDE6DA' },
  husky: { coat: '#6F7B89', light: '#FFFFFF', ear: 'pointy', pattern: 'cap', patch: '#6F7B89', blueEyes: true },
  boxer: { coat: '#C27B3E', light: '#FFFFFF', ear: 'small', pattern: 'mask', patch: '#2E2A28' },
  berner: { coat: '#2A2A2E', light: '#FFFFFF', ear: 'floppy', pattern: 'blaze', tongue: true },
  rottie: { coat: '#26262B', light: '#A8642E', ear: 'small' },
  dobie: { coat: '#26262B', light: '#A8642E', ear: 'pointy' },
  stBernard: { coat: '#B5612C', light: '#FFFFFF', ear: 'floppy', pattern: 'blaze', tongue: true },
  akita: { coat: '#D98C4A', light: '#FFFFFF', ear: 'pointy', pattern: 'blaze' },
  whiteSpitz: { coat: '#FFFFFF', light: '#F6F3EE', ear: 'pointy', tongue: true },
  jrt: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'small', ears: '#B9733A', pattern: 'eye', patch: '#B9733A' },
  schnauzer: { coat: '#8D939B', light: '#D9DCE0', ear: 'small' },
  bullTerrier: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'pointy', pattern: 'eye', patch: '#3A3A40' },
  tan: { coat: '#B98F5E', light: '#E3CBA8', ear: 'small' },
  blueGrey: { coat: '#7E8794', light: '#FFFFFF', ear: 'small', pattern: 'blaze' },
  chi: { coat: '#E1B57A', light: '#FAEBD4', ear: 'bunny' },
  pom: { coat: '#E99A4A', light: '#FBD9B0', ear: 'pointy' },
  yorkie: { coat: '#4A5260', light: '#C99A5E', ear: 'pointy' },
  shihTzu: { coat: '#FFFFFF', light: '#F3EEE6', ear: 'floppy', ears: '#C9955A', pattern: 'eye', patch: '#C9955A' },
  blenheim: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'floppy', ears: '#B35E2A', pattern: 'blaze', tongue: true },
  pug: { coat: '#E2C9A0', light: '#F2E3C8', ear: 'small', ears: '#2E2A28', pattern: 'mask', patch: '#2E2A28' },
  papillon: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'bunny', ears: '#B35E2A', pattern: 'eye', patch: '#B35E2A' },
  apricot: { coat: '#E7B78A', light: '#F6DEC4', ear: 'floppy', ears: '#D9A06E' },
  minPin: { coat: '#26262B', light: '#A8642E', ear: 'bunny' },
  blackWhite: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'floppy', ears: '#2A2A2E', pattern: 'eye', patch: '#2A2A2E' },
  frenchie: { coat: '#D4BC96', light: '#EFE2CB', ear: 'bunny', ears: '#C9A97E', pattern: 'mask', patch: '#3A3330' },
  bulldog: { coat: '#FFFFFF', light: '#F3EEE6', ear: 'small', ears: '#C98A4A', pattern: 'eye', patch: '#C98A4A' },
  poodle: { coat: '#2A2A2E', light: '#3E3E44', ear: 'floppy' },
  boston: { coat: '#26262B', light: '#FFFFFF', ear: 'bunny', pattern: 'blaze' },
  dalmatian: { coat: '#FFFFFF', light: '#F5F1EA', ear: 'floppy', ears: '#26262B', pattern: 'spots', patch: '#26262B', tongue: true },
  chow: { coat: '#C8682E', light: '#E39A62', ear: 'small' },
  mutt: { coat: '#A47A55', light: '#E8D7C2', ear: 'small', ears: '#7C5638', pattern: 'eye', patch: '#7C5638' },
} satisfies Record<string, DogLook>;

type Row = [name: string, rarity: Rarity, look: keyof typeof L];

const GROUPS: [BreedGroup, Row[]][] = [
  [
    'Herding',
    [
      ['Pembroke Welsh Corgi', 'common', 'corgi'],
      ['Border Collie', 'common', 'borderCollie'],
      ['Australian Shepherd', 'common', 'merle'],
      ['German Shepherd', 'common', 'gsd'],
      ['Shetland Sheepdog', 'uncommon', 'sable'],
      ['Cardigan Welsh Corgi', 'uncommon', 'corgi'],
      ['Collie', 'uncommon', 'sable'],
      ['Old English Sheepdog', 'rare', 'shaggy'],
      ['Australian Cattle Dog', 'uncommon', 'blueHeeler'],
      ['Belgian Malinois', 'uncommon', 'gsd'],
      ['Bearded Collie', 'rare', 'shaggy'],
      ['Miniature American Shepherd', 'uncommon', 'merle'],
      ['Puli', 'rare', 'blackShaggy'],
      ['Icelandic Sheepdog', 'rare', 'spitzCream'],
    ],
  ],
  [
    'Sporting',
    [
      ['Golden Retriever', 'common', 'gold'],
      ['Labrador Retriever', 'common', 'blackLab'],
      ['Cocker Spaniel', 'common', 'gold'],
      ['English Springer Spaniel', 'uncommon', 'liverWhite'],
      ['German Shorthaired Pointer', 'uncommon', 'liver'],
      ['Vizsla', 'uncommon', 'rust'],
      ['Weimaraner', 'uncommon', 'greyFloppy'],
      ['Brittany', 'uncommon', 'orangeWhite'],
      ['Irish Setter', 'rare', 'redSetter'],
      ['English Setter', 'rare', 'whiteSpots'],
      ['Chesapeake Bay Retriever', 'rare', 'choc'],
      ['Flat-Coated Retriever', 'rare', 'black'],
      ['Nova Scotia Duck Tolling Retriever', 'rare', 'rust'],
      ['Boykin Spaniel', 'rare', 'choc'],
      ['Spinone Italiano', 'rare', 'orangeWhite'],
      ['Wirehaired Pointing Griffon', 'rare', 'shaggy'],
      ['English Cocker Spaniel', 'uncommon', 'liverWhite'],
      ['Lagotto Romagnolo', 'rare', 'creamCurly'],
    ],
  ],
  [
    'Hound',
    [
      ['Beagle', 'common', 'beagle'],
      ['Dachshund', 'common', 'doxie'],
      ['Basset Hound', 'uncommon', 'beagle'],
      ['Greyhound', 'uncommon', 'grey'],
      ['Whippet', 'uncommon', 'fawn'],
      ['Bloodhound', 'rare', 'redSetter'],
      ['Rhodesian Ridgeback', 'uncommon', 'wheat'],
      ['Basenji', 'rare', 'basenji'],
      ['Afghan Hound', 'rare', 'cream'],
      ['Italian Greyhound', 'uncommon', 'grey'],
      ['Saluki', 'rare', 'cream'],
      ['Irish Wolfhound', 'rare', 'shaggy'],
      ['Norwegian Elkhound', 'rare', 'husky'],
      ['Black and Tan Coonhound', 'rare', 'blackTan'],
      ['Borzoi', 'rare', 'white'],
      ['Redbone Coonhound', 'rare', 'rust'],
    ],
  ],
  [
    'Working',
    [
      ['Siberian Husky', 'common', 'husky'],
      ['Boxer', 'common', 'boxer'],
      ['Bernese Mountain Dog', 'uncommon', 'berner'],
      ['Rottweiler', 'uncommon', 'rottie'],
      ['Great Dane', 'uncommon', 'fawnMask'],
      ['Doberman Pinscher', 'uncommon', 'dobie'],
      ['Alaskan Malamute', 'uncommon', 'husky'],
      ['Saint Bernard', 'rare', 'stBernard'],
      ['Newfoundland', 'rare', 'black'],
      ['Samoyed', 'uncommon', 'whiteSpitz'],
      ['Akita', 'rare', 'akita'],
      ['Cane Corso', 'uncommon', 'greyFloppy'],
      ['Mastiff', 'rare', 'fawnMask'],
      ['Great Pyrenees', 'rare', 'white'],
      ['Portuguese Water Dog', 'rare', 'poodle'],
      ['Bullmastiff', 'rare', 'fawnMask'],
    ],
  ],
  [
    'Terrier',
    [
      ['Jack Russell Terrier', 'common', 'jrt'],
      ['Miniature Schnauzer', 'common', 'schnauzer'],
      ['West Highland White Terrier', 'uncommon', 'whiteSpitz'],
      ['Scottish Terrier', 'rare', 'black'],
      ['Bull Terrier', 'rare', 'bullTerrier'],
      ['Airedale Terrier', 'rare', 'blackTan'],
      ['Cairn Terrier', 'uncommon', 'tan'],
      ['Border Terrier', 'uncommon', 'tan'],
      ['Soft Coated Wheaten Terrier', 'uncommon', 'wheat'],
      ['Wire Fox Terrier', 'rare', 'jrt'],
      ['Rat Terrier', 'uncommon', 'jrt'],
      ['American Staffordshire Terrier', 'uncommon', 'blueGrey'],
      ['Staffordshire Bull Terrier', 'uncommon', 'boxer'],
      ['Bedlington Terrier', 'rare', 'cream'],
    ],
  ],
  [
    'Toy',
    [
      ['Chihuahua', 'common', 'chi'],
      ['Pomeranian', 'common', 'pom'],
      ['Yorkshire Terrier', 'common', 'yorkie'],
      ['Shih Tzu', 'common', 'shihTzu'],
      ['Cavalier King Charles Spaniel', 'common', 'blenheim'],
      ['Pug', 'common', 'pug'],
      ['Maltese', 'uncommon', 'white'],
      ['Papillon', 'uncommon', 'papillon'],
      ['Havanese', 'uncommon', 'cream'],
      ['Toy Poodle', 'uncommon', 'apricot'],
      ['Miniature Pinscher', 'uncommon', 'minPin'],
      ['Pekingese', 'rare', 'fawnMask'],
      ['Brussels Griffon', 'rare', 'rust'],
      ['Chinese Crested', 'rare', 'spitzCream'],
      ['Japanese Chin', 'rare', 'blackWhite'],
      ['Affenpinscher', 'rare', 'black'],
    ],
  ],
  [
    'Non-Sporting',
    [
      ['French Bulldog', 'common', 'frenchie'],
      ['Bulldog', 'common', 'bulldog'],
      ['Poodle', 'common', 'poodle'],
      ['Boston Terrier', 'common', 'boston'],
      ['Shiba Inu', 'uncommon', 'shiba'],
      ['Dalmatian', 'uncommon', 'dalmatian'],
      ['Bichon Frise', 'uncommon', 'white'],
      ['Lhasa Apso', 'uncommon', 'cream'],
      ['Chow Chow', 'rare', 'chow'],
      ['Chinese Shar-Pei', 'rare', 'fawn'],
      ['Keeshond', 'rare', 'husky'],
      ['Miniature Poodle', 'uncommon', 'apricot'],
      ['Schipperke', 'rare', 'black'],
      ['Tibetan Terrier', 'rare', 'cream'],
      ['Löwchen', 'rare', 'cream'],
      ['American Eskimo Dog', 'uncommon', 'whiteSpitz'],
    ],
  ],
  [
    'Mixed',
    [
      ['Mixed breed', 'common', 'mutt'],
      ['Goldendoodle', 'common', 'apricot'],
      ['Labradoodle', 'common', 'cream'],
      ['Cockapoo', 'common', 'apricot'],
      ['Pit Bull mix', 'common', 'blueGrey'],
      ['Cavapoo', 'uncommon', 'apricot'],
      ['Maltipoo', 'uncommon', 'white'],
      ['Puggle', 'uncommon', 'fawn'],
      ['Pomsky', 'rare', 'husky'],
      ['Bernedoodle', 'rare', 'berner'],
    ],
  ],
];

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const BREEDS: Breed[] = GROUPS.flatMap(([group, rows]) =>
  rows.map(([name, rarity, look]) => ({ group, name, rarity, look: L[look] as DogLook })),
).map((b, i) => ({ ...b, id: slug(b.name), number: i + 1 }));

export const GROUP_NAMES: BreedGroup[] = GROUPS.map(([g]) => g);

const byId = new Map(BREEDS.map((b) => [b.id, b]));

export const MIXED_BREED_ID = 'mixed-breed';

export function getBreed(id: string): Breed {
  return byId.get(id) ?? byId.get(MIXED_BREED_ID)!;
}

/** The most common breeds, offered first when you tag a new catch. */
export const POPULAR_BREED_IDS = [
  'golden-retriever',
  'labrador-retriever',
  'french-bulldog',
  'pembroke-welsh-corgi',
  'beagle',
  'german-shepherd',
  'dachshund',
  'poodle',
  'siberian-husky',
  'pug',
];

export const formatNumber = (n: number) => `#${String(n).padStart(3, '0')}`;
