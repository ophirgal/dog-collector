import type { StyleProp, ViewStyle } from 'react-native';

import type { LatLng } from '@/game/sightings';

export type MapPin = {
  id: string;
  coordinate: LatLng;
  breedId: string;
  photoUri?: string;
  ring: string;
  faded?: boolean;
  label?: string;
  size?: number;
};

export type MapArea = { id: string; center: LatLng; radius: number; color: string; label?: string };

export type MapCanvasProps = {
  center: LatLng;
  pins: MapPin[];
  areas?: MapArea[];
  onPinPress?: (id: string) => void;
  /** Move the camera here when it changes. */
  focus?: LatLng | null;
  /** Rough width of the visible area, in meters. */
  spanMeters?: number;
  interactive?: boolean;
  showsUser?: boolean;
  style?: StyleProp<ViewStyle>;
};
