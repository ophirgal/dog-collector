import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export type IconName =
  | 'map'
  | 'feed'
  | 'camera'
  | 'crown'
  | 'paw'
  | 'gem'
  | 'heart'
  | 'heart-filled'
  | 'navigate'
  | 'gear'
  | 'close'
  | 'flip'
  | 'share'
  | 'more'
  | 'lock'
  | 'search'
  | 'back'
  | 'pencil'
  | 'check'
  | 'retake'
  | 'pin'
  | 'chevron';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

export function Icon({ name, size = 24, color = colors.ink, strokeWidth = 2 }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const f = { fill: color };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'map' && <Path {...s} d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5ZM9 4v13.5M15 6.5V20" />}
      {name === 'feed' && (
        <>
          <Rect {...s} x={4} y={3} width={16} height={18} rx={3} />
          <Circle {...s} cx={12} cy={9.5} r={2.5} />
          <Path {...s} d="M8 16h8" />
        </>
      )}
      {name === 'camera' && (
        <>
          <Path {...s} d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2h5.6l1.5 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
          <Circle {...s} cx={12} cy={13} r={3.5} />
        </>
      )}
      {name === 'crown' && <Path {...s} d="M3.5 8 7.5 12 12 5.5 16.5 12 20.5 8 19 18H5L3.5 8Z" />}
      {name === 'paw' && (
        <>
          <Circle {...f} cx={7} cy={9} r={2} />
          <Circle {...f} cx={10.5} cy={5.8} r={2} />
          <Circle {...f} cx={14.5} cy={5.8} r={2} />
          <Circle {...f} cx={18} cy={9} r={2} />
          <Path {...f} d="M12.5 10.5c2.6 0 5.5 3.6 5.5 6 0 1.8-1.4 2.5-2.7 2.5-1.2 0-1.8-.6-2.8-.6s-1.6.6-2.8.6C8.4 19 7 18.3 7 16.5c0-2.4 2.9-6 5.5-6Z" />
        </>
      )}
      {name === 'gem' && (
        <>
          <Path fill={color} d="M6.5 4h11L22 9.5 12 21 2 9.5 6.5 4Z" />
          <Path fill="#fff" opacity={0.35} d="M2 9.5h20L12 21 2 9.5Z" />
          <Path fill="#fff" opacity={0.5} d="M8.5 9.5 12 4l3.5 5.5h-7Z" />
        </>
      )}
      {name === 'heart' && <Path {...s} d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />}
      {name === 'heart-filled' && <Path {...f} d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />}
      {name === 'navigate' && <Path {...f} d="M20 4 4 11l7 2 2 7 7-16Z" />}
      {name === 'gear' && (
        <>
          <Circle {...s} cx={12} cy={12} r={3} />
          <Path {...s} d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
        </>
      )}
      {name === 'close' && <Path {...s} d="M6 6l12 12M18 6 6 18" />}
      {name === 'flip' && <Path {...s} d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5" />}
      {name === 'share' && <Path {...s} d="M12 15V3.5M7.5 8 12 3.5 16.5 8M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5" />}
      {name === 'more' && (
        <>
          <Circle {...f} cx={5.5} cy={12} r={1.8} />
          <Circle {...f} cx={12} cy={12} r={1.8} />
          <Circle {...f} cx={18.5} cy={12} r={1.8} />
        </>
      )}
      {name === 'lock' && (
        <>
          <Rect {...s} x={5} y={10.5} width={14} height={10} rx={2} />
          <Path {...s} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle {...s} cx={10.5} cy={10.5} r={6} />
          <Path {...s} d="m15 15 5 5" />
        </>
      )}
      {name === 'back' && <Path {...s} d="M15 5 8 12l7 7" />}
      {name === 'chevron' && <Path {...s} d="m9 5 7 7-7 7" />}
      {name === 'pencil' && <Path {...s} d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />}
      {name === 'check' && <Path {...s} d="m5 12.5 4.5 4.5L19 7.5" />}
      {name === 'retake' && <Path {...s} d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9M4.5 4.5V9H9" />}
      {name === 'pin' && (
        <>
          <Path {...f} d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Z" />
          <Circle fill="#fff" cx={12} cy={9.5} r={2.6} />
        </>
      )}
    </Svg>
  );
}
