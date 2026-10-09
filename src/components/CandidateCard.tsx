import { Image, Pressable, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { getBreed } from '@/data/breeds';
import type { Candidate } from '@/game/topDog';
import { colors, tintFor } from '@/theme';

type Props = {
  candidate: Candidate;
  percent?: number;
  chosen?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  tint?: string;
};

export function CandidateCard({ candidate, percent, chosen, disabled, onPress, tint }: Props) {
  const breed = getBreed(candidate.breedId);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Vote for ${candidate.name}`}
      style={({ pressed }) => ({
        flex: 1,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: chosen ? colors.yellow : 'transparent',
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View style={{ flex: 1, backgroundColor: tint ?? tintFor(candidate.id), alignItems: 'center', justifyContent: 'flex-end' }}>
        {candidate.photoUri ? (
          <Image source={{ uri: candidate.photoUri }} style={{ position: 'absolute', width: '100%', height: '100%' }} />
        ) : (
          <DogArt look={breed.look} size={110} />
        )}
        {percent !== undefined && (
          <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: colors.night, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <AppText weight="bold" size={14} color={colors.yellow}>
              {percent}%
            </AppText>
          </View>
        )}
      </View>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <AppText weight="black" size={17}>
          {candidate.name}
          {candidate.dogId ? (
            <AppText weight="semibold" size={13} color={colors.green}>
              {'  '}yours
            </AppText>
          ) : null}
        </AppText>
        <AppText size={12} color={colors.muted}>
          {breed.name} · @{candidate.owner}
        </AppText>
      </View>
    </Pressable>
  );
}
