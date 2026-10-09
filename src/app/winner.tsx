import { router } from 'expo-router';
import { Alert, Image, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { Icon } from '@/components/Icon';
import { Button, GemCost, IconButton } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { getCommunityDog } from '@/data/community';
import { addDays, fromDayKey, shortDate } from '@/game/dates';
import { canClaim, collect, COLLECT_COST, hasCollected } from '@/game/logic';
import { standings } from '@/game/topDog';
import { useGame, useToday } from '@/state/store';
import { useTopDogGame } from '@/state/useTopDog';
import { colors, radius } from '@/theme';

function Sunburst() {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a1 = (i / 16) * Math.PI * 2;
    const a2 = a1 + Math.PI / 32;
    const r = 900;
    return `M200 260 L${200 + Math.cos(a1) * r} ${260 + Math.sin(a1) * r} L${200 + Math.cos(a2) * r} ${260 + Math.sin(a2) * r} Z`;
  });
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute' }}>
      {rays.map((d, i) => (
        <Path key={i} d={d} fill="#FFD866" />
      ))}
    </Svg>
  );
}

export default function Winner() {
  const insets = useSafeAreaInsets();
  const { state, attempt } = useGame();
  const today = useToday();
  const yesterday = addDays(today, -1);
  const { game, votes } = useTopDogGame(yesterday);
  const table = standings(game, votes);
  const champ = table[0].candidate;
  const breed = getBreed(champ.breedId);
  const community = getCommunityDog(champ.id);
  const mine = !!champ.dogId;
  const owned = community ? hasCollected(state, community.id) : true;

  const onCollect = () => {
    if (!community) return;
    const r = attempt((s) => collect(s, community));
    if (!r.ok && r.reason === 'no-gems') {
      Alert.alert('Out of gems', 'Collecting a dog costs one gem.', [
        { text: 'Not now', style: 'cancel' },
        canClaim(state, today)
          ? { text: 'Claim free gem', onPress: () => router.replace('/profile') }
          : { text: 'Get gems', onPress: () => router.replace('/plus') },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.yellow }}>
      <Sunburst />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' }}>
        <AppText weight="bold" size={12} color="#8A6A12" style={{ letterSpacing: 1.5 }}>
          YESTERDAY’S WINNER · {shortDate(fromDayKey(yesterday)).toUpperCase()}
        </AppText>
        <View style={{ marginTop: 16 }}>
          <Icon name="crown" size={64} color={colors.ink} strokeWidth={1.6} />
        </View>
        {champ.photoUri ? (
          <Image source={{ uri: champ.photoUri }} style={{ width: 220, height: 220, borderRadius: 110, borderWidth: 6, borderColor: colors.white }} />
        ) : (
          <DogArt look={breed.look} size={200} />
        )}
        <AppText weight="black" size={40} align="center" style={{ marginTop: 8 }}>
          {champ.name}
        </AppText>
        <AppText size={14} color="#6B5410" align="center">
          {breed.name} · caught by @{champ.owner} in {champ.neighborhood}
        </AppText>
        {mine && (
          <View style={{ marginTop: 10, backgroundColor: colors.night, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 }}>
            <AppText weight="bold" size={13} color={colors.yellow}>
              Your dog took the crown!
            </AppText>
          </View>
        )}

        <View style={{ alignSelf: 'stretch', backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginTop: 20, gap: 12 }}>
          <AppText weight="bold" size={15}>
            Final standings · {game.theme.title}
          </AppText>
          {table.slice(0, 3).map((row, i) => (
            <View key={row.candidate.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <AppText weight="semibold" size={14} color={colors.muted} style={{ width: 14 }}>
                {i + 1}
              </AppText>
              <DogArt look={getBreed(row.candidate.breedId).look} size={26} />
              <AppText weight="semibold" size={15} style={{ flex: 1 }}>
                {row.candidate.name}
                {row.candidate.dogId ? (
                  <AppText weight="semibold" size={12} color={colors.green}>
                    {'  '}yours
                  </AppText>
                ) : null}
              </AppText>
              <AppText weight="bold" size={15}>
                {row.percent}%
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }}>
        {mine || owned ? (
          <Button label={mine ? 'Back to Top Dog' : `${champ.name} is in your pack`} variant="dark" onPress={() => router.back()} />
        ) : (
          <Button label={`Collect ${champ.name}`} variant="dark" onPress={onCollect} trailing={<GemCost cost={COLLECT_COST} />} />
        )}
      </View>
      <View style={{ position: 'absolute', top: insets.top + 8, right: 16 }}>
        <IconButton name="close" label="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}
