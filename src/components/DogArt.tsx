import { memo } from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import type { DogLook } from '@/data/breeds';

const INK = '#1D1F24';
const PINK = '#F4B6B0';
const SILHOUETTE = '#D6D1C5';

type Props = {
  look: DogLook;
  size?: number;
  /** Grey shape with no face, for breeds you haven't caught yet. */
  silhouette?: boolean;
};

/** Placeholder sticker art for a breed, drawn from a few parameters. */
export const DogArt = memo(function DogArt({ look, size = 96, silhouette = false }: Props) {
  const coat = silhouette ? SILHOUETTE : look.coat;
  const light = silhouette ? SILHOUETTE : look.light;
  const ears = silhouette ? SILHOUETTE : (look.ears ?? look.coat);
  const patch = silhouette ? SILHOUETTE : (look.patch ?? look.coat);
  const pattern = silhouette ? 'none' : (look.pattern ?? 'none');
  const outline = silhouette ? 'none' : '#FFFFFF';
  const o = { stroke: outline, strokeWidth: 2.5 };

  const earsBehind = look.ear === 'pointy' || look.ear === 'bunny';

  const earShapes = (
    <G>
      {look.ear === 'pointy' && (
        <>
          <Path d="M29 36 L27 9 L47 25 Z" fill={ears} {...o} strokeLinejoin="round" />
          <Path d="M71 36 L73 9 L53 25 Z" fill={ears} {...o} strokeLinejoin="round" />
          {!silhouette && <Path d="M31.5 30 L30.5 15 L42 25 Z" fill={PINK} />}
          {!silhouette && <Path d="M68.5 30 L69.5 15 L58 25 Z" fill={PINK} />}
        </>
      )}
      {look.ear === 'bunny' && (
        <>
          <Ellipse cx={35} cy={18} rx={7.5} ry={15} transform="rotate(-14 35 18)" fill={ears} {...o} />
          <Ellipse cx={65} cy={18} rx={7.5} ry={15} transform="rotate(14 65 18)" fill={ears} {...o} />
          {!silhouette && <Ellipse cx={35} cy={19} rx={3.5} ry={10} transform="rotate(-14 35 19)" fill={PINK} />}
          {!silhouette && <Ellipse cx={65} cy={19} rx={3.5} ry={10} transform="rotate(14 65 19)" fill={PINK} />}
        </>
      )}
      {look.ear === 'floppy' && (
        <>
          <Ellipse cx={28} cy={47} rx={9} ry={17} transform="rotate(18 28 47)" fill={ears} {...o} />
          <Ellipse cx={72} cy={47} rx={9} ry={17} transform="rotate(-18 72 47)" fill={ears} {...o} />
        </>
      )}
      {look.ear === 'small' && (
        <>
          <Path d="M28 32 L32 19 L45 25 Q37 34 28 32 Z" fill={ears} {...o} strokeLinejoin="round" />
          <Path d="M72 32 L68 19 L55 25 Q63 34 72 32 Z" fill={ears} {...o} strokeLinejoin="round" />
        </>
      )}
    </G>
  );

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      {/* tail */}
      <Path d="M66 102 C82 100 87 87 84 75" stroke={outline} strokeWidth={11} strokeLinecap="round" fill="none" />
      <Path d="M66 102 C82 100 87 87 84 75" stroke={coat} strokeWidth={6.5} strokeLinecap="round" fill="none" />
      {/* body */}
      <Path d="M29 113 C25 90 32 68 50 67 C68 68 75 90 71 113 Z" fill={coat} {...o} />
      {pattern === 'saddle' && <Ellipse cx={61} cy={88} rx={9} ry={13} fill={patch} />}
      <Ellipse cx={50} cy={94} rx={11.5} ry={16} fill={light} />
      {pattern === 'spots' && (
        <>
          <Circle cx={36} cy={88} r={3.2} fill={patch} />
          <Circle cx={64} cy={95} r={2.6} fill={patch} />
          <Circle cx={60} cy={106} r={2.2} fill={patch} />
          <Circle cx={38} cy={103} r={2} fill={patch} />
        </>
      )}
      <Path d="M44.5 100 V111 M55.5 100 V111" stroke={silhouette ? 'none' : coat} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
      <Ellipse cx={42} cy={112.5} rx={7} ry={3.6} fill={light} {...o} strokeWidth={1.5} />
      <Ellipse cx={58} cy={112.5} rx={7} ry={3.6} fill={light} {...o} strokeWidth={1.5} />

      {earsBehind && earShapes}
      {/* head */}
      <Ellipse cx={50} cy={44} rx={24} ry={21} fill={coat} {...o} />
      {pattern === 'cap' && <Path d="M26.5 42 A24 21 0 0 1 73.5 42 Q62 37 50 47 Q38 37 26.5 42 Z" fill={patch} />}
      {pattern === 'cap' && look.light === '#FFFFFF' && <Ellipse cx={50} cy={52} rx={16} ry={12} fill={light} />}
      {pattern === 'blaze' && <Ellipse cx={50} cy={42} rx={5} ry={17} fill={light} />}
      {pattern === 'eye' && <Circle cx={40.5} cy={43} r={7.5} fill={patch} />}
      {pattern === 'spots' && <Circle cx={63} cy={33} r={2.6} fill={patch} />}
      {!earsBehind && earShapes}

      {!silhouette && (
        <>
          <Ellipse cx={50} cy={54} rx={10} ry={7.5} fill={pattern === 'mask' ? patch : light} />
          {look.blueEyes ? (
            <>
              <Circle cx={41} cy={44} r={3.8} fill="#5DA9E9" />
              <Circle cx={59} cy={44} r={3.8} fill="#5DA9E9" />
              <Circle cx={41} cy={44} r={2} fill={INK} />
              <Circle cx={59} cy={44} r={2} fill={INK} />
            </>
          ) : (
            <>
              <Circle cx={41} cy={44} r={3.4} fill={INK} />
              <Circle cx={59} cy={44} r={3.4} fill={INK} />
            </>
          )}
          <Circle cx={42.2} cy={42.8} r={1.1} fill="#fff" />
          <Circle cx={60.2} cy={42.8} r={1.1} fill="#fff" />
          <Ellipse cx={50} cy={51} rx={3.8} ry={2.8} fill={INK} />
          <Path
            d="M46 55 Q48 58 50 55 Q52 58 54 55"
            stroke={pattern === 'mask' ? '#fff' : INK}
            strokeWidth={1.4}
            fill="none"
            strokeLinecap="round"
          />
          {look.tongue && <Path d="M48 56.8 h4 v2.8 a2 2 0 0 1 -4 0 Z" fill="#F07C8A" />}
        </>
      )}
    </Svg>
  );
});
