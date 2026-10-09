import { Image, View, type ViewStyle } from 'react-native';

import { DogArt } from '@/components/DogArt';
import { getBreed } from '@/data/breeds';
import { colors } from '@/theme';

type Props = {
  breedId: string;
  photoUri?: string;
  /** Width of the art, or the side of the photo box. */
  size: number;
  style?: ViewStyle;
};

/** Your own photo when there is one, otherwise the breed's sticker art. */
export function DogPicture({ breedId, photoUri, size, style }: Props) {
  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={[{ width: size, height: size, borderRadius: 14, backgroundColor: colors.sand }, style as object]}
        resizeMode="cover"
      />
    );
  }
  return (
    <View style={style}>
      <DogArt look={getBreed(breedId).look} size={size * 0.83} />
    </View>
  );
}

type BubbleProps = { breedId: string; photoUri?: string; size?: number; ring?: string; faded?: boolean };

/** Round avatar used for map pins and post headers. */
export function DogBubble({ breedId, photoUri, size = 52, ring = colors.green, faded }: BubbleProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: Math.max(2, size * 0.06),
        borderColor: ring,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: faded ? 0.6 : 1,
      }}
    >
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: size, height: size }} />
      ) : (
        <View style={{ marginTop: size * 0.12 }}>
          <DogArt look={getBreed(breedId).look} size={size * 0.78} />
        </View>
      )}
    </View>
  );
}
