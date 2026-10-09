import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DogBubble } from '@/components/DogPicture';
import type { MapPin } from '@/components/mapTypes';
import { colors } from '@/theme';

export function MapPinView({ pin }: { pin: MapPin }) {
  const size = pin.size ?? 54;
  return (
    <View style={{ alignItems: 'center', opacity: pin.faded ? 0.65 : 1 }}>
      <DogBubble breedId={pin.breedId} photoUri={pin.photoUri} size={size} ring={pin.ring} />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 7,
          borderRightWidth: 7,
          borderTopWidth: 9,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: pin.ring,
          marginTop: -1,
        }}
      />
      {pin.label ? (
        <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1, marginTop: 2 }}>
          <AppText weight="semibold" size={12} color={colors.inkSoft}>
            {pin.label}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
