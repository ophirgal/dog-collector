import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogBubble } from '@/components/DogPicture';
import { Icon, type IconName } from '@/components/Icon';
import { IconButton } from '@/components/ui';
import { badges, type BadgeId } from '@/game/badges';
import { monthYear } from '@/game/dates';
import { canClaim, caughtBreedIds, claimGems, gemsPerDay } from '@/game/logic';
import { useGame, useToday } from '@/state/store';
import { colors, radius } from '@/theme';

const BADGE_ICON: Record<BadgeId, IconName> = {
  'top-dog': 'crown',
  'twenty-breeds': 'paw',
  'seven-day-walk': 'navigate',
  'pack-leader': 'heart-filled',
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { state, update, attempt, reset } = useGame();
  const today = useToday();
  const claimable = canClaim(state, today);
  const perDay = gemsPerDay(state.plus);

  const claim = () => {
    const r = attempt((s) => claimGems(s, today));
    if (r.ok && Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const settings = () =>
    Alert.alert('Settings', undefined, [
      {
        text: 'Erase all data',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Erase everything?', 'Your pack, gems and username are stored only on this phone and will be gone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Erase',
              style: 'destructive',
              onPress: () => {
                reset();
                router.replace('/welcome');
              },
            },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const stats: [number, string][] = [
    [state.dogs.length, 'Dogs'],
    [caughtBreedIds(state).size, 'Breeds'],
    [state.topDogWins.length, 'Top Dog wins'],
  ];

  const row = (label: string, value: string, onPress: () => void) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', padding: 16, opacity: pressed ? 0.6 : 1 })}
    >
      <AppText weight="semibold" size={15} style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText size={14} color={colors.muted}>
        {value}
      </AppText>
      <Icon name="chevron" size={16} color={colors.muted} />
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconButton name="back" label="Back" onPress={() => router.back()} />
        <IconButton name="gear" label="Settings" onPress={settings} />
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <DogBubble breedId={state.dogs[0]?.breedId ?? 'pembroke-welsh-corgi'} photoUri={state.dogs[0]?.photoUri} size={104} ring={state.plus ? colors.yellow : colors.green} />
        <AppText weight="black" size={24} style={{ marginTop: 6 }}>
          @{state.username}
        </AppText>
        <AppText size={13} color={colors.muted}>
          {state.plus && (
            <AppText weight="bold" size={13} color="#C99A1E">
              Plus member ·{' '}
            </AppText>
          )}
          collecting since {monthYear(new Date(state.joinedAt))}
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        {stats.map(([n, label]) => (
          <View key={label} style={{ flex: 1, backgroundColor: colors.white, borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>
            <AppText weight="black" size={22}>
              {n}
            </AppText>
            <AppText size={12} color={colors.muted}>
              {label}
            </AppText>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.green, borderRadius: radius.lg, padding: 16, marginTop: 16 }}>
        <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="gem" size={26} color="#9ED3FF" />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="bold" size={16} color={colors.white}>
            {claimable ? 'Gem pouch is full' : 'Pouch refills tomorrow'}
          </AppText>
          <AppText size={13} color="#CBE7DA">
            {claimable ? `${perDay} free gem${perDay > 1 ? 's' : ''} ready to claim today` : `You have ${state.gems} gems`}
          </AppText>
        </View>
        <Pressable
          disabled={!claimable}
          onPress={claim}
          accessibilityRole="button"
          style={{ backgroundColor: claimable ? colors.yellow : 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 16, height: 38, justifyContent: 'center' }}
        >
          <AppText weight="bold" size={14} color={claimable ? colors.ink : colors.white}>
            {claimable ? 'Claim' : 'Claimed'}
          </AppText>
        </Pressable>
      </View>

      <AppText weight="bold" size={16} style={{ marginTop: 22, marginBottom: 10 }}>
        Badges
      </AppText>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {badges(state).map((b) => (
          <Pressable
            key={b.id}
            onPress={() => Alert.alert(b.label, b.earned ? `Earned: ${b.detail.toLowerCase()}.` : `${b.detail} to earn this badge.`)}
            style={{
              flex: 1,
              aspectRatio: 0.9,
              borderRadius: 16,
              backgroundColor: b.earned ? colors.yellowSoft : colors.sand,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: 6,
            }}
          >
            <Icon name={b.earned ? BADGE_ICON[b.id] : 'lock'} size={24} color={b.earned ? '#C99A1E' : colors.muted} />
            <AppText weight="semibold" size={11} color={b.earned ? colors.ink : colors.muted} align="center">
              {b.label}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, marginTop: 20 }}>
        {row('Friends', String(state.following.length), () => router.navigate('/feed'))}
        <View style={{ height: 1, backgroundColor: colors.line, marginHorizontal: 16 }} />
        {row('Privacy & location', state.privacy === 'neighborhood' ? 'Neighborhood' : 'Hidden', () =>
          Alert.alert(
            'What others see',
            'You always see the exact spot you met each dog. Choose what your posts show to other collectors.',
            [
              { text: 'Neighborhood', onPress: () => update((s) => ({ ...s, privacy: 'neighborhood' })) },
              { text: 'Hide location', onPress: () => update((s) => ({ ...s, privacy: 'hidden' })) },
              { text: 'Cancel', style: 'cancel' },
            ],
          ),
        )}
        <View style={{ height: 1, backgroundColor: colors.line, marginHorizontal: 16 }} />
        {row('Dog Collector Plus', state.plus ? 'Active' : 'Learn more', () => router.push('/plus'))}
      </View>
    </ScrollView>
  );
}
