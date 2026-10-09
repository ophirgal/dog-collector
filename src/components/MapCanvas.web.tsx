import { useState } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { MapPinView } from '@/components/MapPinView';
import type { MapCanvasProps } from '@/components/mapTypes';
import { colors } from '@/theme';

const M_PER_DEG = 111_320;

/**
 * react-native-maps has no web support, so the web build draws a simple
 * illustrated map and places pins by their distance from the center.
 */
export function MapCanvas({ center, pins, areas = [], onPinPress, focus, spanMeters = 1200, showsUser = true, style }: MapCanvasProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const origin = focus ?? center;
  const scale = size.w / spanMeters;
  const project = (p: { latitude: number; longitude: number }) => ({
    x: size.w / 2 + (p.longitude - origin.longitude) * M_PER_DEG * Math.cos((origin.latitude * Math.PI) / 180) * scale,
    y: size.h / 2 - (p.latitude - origin.latitude) * M_PER_DEG * scale,
  });
  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const me = project(center);

  return (
    <View style={[{ backgroundColor: '#EEF0E8', overflow: 'hidden' }, style]} onLayout={onLayout}>
      {size.w > 0 && (
        <>
          <Svg width={size.w} height={size.h} style={{ position: 'absolute' }}>
            <Rect x={size.w * 0.08} y={size.h * 0.12} width={size.w * 0.52} height={size.h * 0.22} rx={8} fill={colors.park} />
            <Rect x={size.w * 0.66} y={size.h * 0.5} width={size.w * 0.4} height={size.h * 0.18} rx={8} fill={colors.park} />
            <Path d={`M0 ${size.h * 0.78} Q ${size.w * 0.4} ${size.h * 0.7} ${size.w} ${size.h * 0.8} V ${size.h} H 0 Z`} fill={colors.water} />
            <Path d={`M0 ${size.h * 0.38} L ${size.w} ${size.h * 0.34}`} stroke="#fff" strokeWidth={14} />
            <Path d={`M0 ${size.h * 0.6} L ${size.w} ${size.h * 0.58}`} stroke="#fff" strokeWidth={10} />
            <Path d={`M${size.w * 0.62} 0 L ${size.w * 0.6} ${size.h}`} stroke="#fff" strokeWidth={14} />
            <Path d={`M${size.w * 0.15} ${size.h * 0.36} Q ${size.w * 0.3} ${size.h * 0.2} ${size.w * 0.45} ${size.h * 0.13}`} stroke="#FBF3D9" strokeWidth={6} fill="none" />
            {areas.map((a) => {
              const p = project(a.center);
              return <Circle key={a.id} cx={p.x} cy={p.y} r={a.radius * scale} fill={a.color} />;
            })}
            {showsUser && (
              <>
                <Circle cx={me.x} cy={me.y} r={60} fill={colors.green} opacity={0.1} />
                <Circle cx={me.x} cy={me.y} r={11} fill="#fff" />
                <Circle cx={me.x} cy={me.y} r={8} fill={colors.green} />
              </>
            )}
          </Svg>
          {pins.map((pin) => {
            const p = project(pin.coordinate);
            const s = pin.size ?? 54;
            return (
              <Pressable
                key={pin.id}
                onPress={() => onPinPress?.(pin.id)}
                style={{ position: 'absolute', left: p.x - s / 2 - 20, top: p.y - s - 4, width: s + 40, alignItems: 'center' }}
              >
                <MapPinView pin={pin} />
              </Pressable>
            );
          })}
        </>
      )}
    </View>
  );
}
