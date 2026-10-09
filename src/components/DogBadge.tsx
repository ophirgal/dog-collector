import { StyleSheet, Text, View } from 'react-native';
import type { Breed } from '../data/breeds';

type Props = { breed: Breed; size?: number; silhouette?: boolean };

// Placeholder art: the breed's emoji on its colour. Silhouettes are for
// breeds the player has not caught yet.
export function DogBadge({ breed, size = 44, silhouette = false }: Props) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: silhouette ? '#D9D9D9' : breed.color,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.55, opacity: silhouette ? 0.15 : 1 }}>
        {silhouette ? '🐕' : breed.emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
