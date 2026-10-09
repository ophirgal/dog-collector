import { useEffect, useRef } from 'react';
import MapView, { Circle, Marker } from 'react-native-maps';

import { MapPinView } from '@/components/MapPinView';
import type { MapCanvasProps } from '@/components/mapTypes';

const M_PER_DEG = 111_320;

export function MapCanvas({
  center,
  pins,
  areas = [],
  onPinPress,
  focus,
  spanMeters = 1200,
  interactive = true,
  showsUser = true,
  style,
}: MapCanvasProps) {
  const ref = useRef<MapView>(null);
  const delta = spanMeters / M_PER_DEG;

  useEffect(() => {
    if (focus) ref.current?.animateToRegion({ ...focus, latitudeDelta: delta, longitudeDelta: delta }, 400);
  }, [focus, delta]);

  return (
    <MapView
      ref={ref}
      style={style}
      initialRegion={{ ...center, latitudeDelta: delta, longitudeDelta: delta }}
      showsUserLocation={showsUser}
      showsMyLocationButton={false}
      showsPointsOfInterests={false}
      toolbarEnabled={false}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      rotateEnabled={false}
      pitchEnabled={false}
    >
      {areas.map((a) => (
        <Circle key={a.id} center={a.center} radius={a.radius} fillColor={a.color} strokeColor="transparent" />
      ))}
      {pins.map((p) => (
        <Marker key={p.id} coordinate={p.coordinate} anchor={{ x: 0.5, y: 0.75 }} onPress={() => onPinPress?.(p.id)}>
          <MapPinView pin={p} />
        </Marker>
      ))}
    </MapView>
  );
}
