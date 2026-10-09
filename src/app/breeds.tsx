import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { Icon } from '@/components/Icon';
import { Chip, IconButton } from '@/components/ui';
import { BREEDS, formatNumber, GROUP_NAMES, type BreedGroup } from '@/data/breeds';
import { nextMilestone } from '@/game/badges';
import { caughtBreedIds } from '@/game/logic';
import { useGame } from '@/state/store';
import { colors, fonts } from '@/theme';

export default function BreedIndex() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cell = Math.floor((width - 32 - 8 * 3) / 4);
  const { state } = useGame();
  const caught = useMemo(() => caughtBreedIds(state), [state]);
  const [group, setGroup] = useState<BreedGroup | 'all'>('all');
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const next = nextMilestone(caught.size);
  const pct = caught.size / BREEDS.length;

  const query = q.trim().toLowerCase();
  const groups = GROUP_NAMES.filter((g) => group === 'all' || g === group);

  const openBreed = (breedId: string) => {
    const dog = state.dogs.find((d) => d.breedId === breedId && d.source === 'caught');
    if (dog) router.push(`/dog/${dog.id}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 }}>
        <IconButton name="back" label="Back" onPress={() => router.back()} />
        {searching ? (
          <TextInput
            value={q}
            onChangeText={setQ}
            autoFocus
            placeholder="Search breeds"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, height: 40, fontFamily: fonts.semibold, fontSize: 17, color: colors.ink }}
          />
        ) : (
          <AppText weight="black" size={28} style={{ flex: 1 }}>
            Breed Index
          </AppText>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={searching ? 'Close search' : 'Search'}
          onPress={() => {
            setSearching((v) => !v);
            setQ('');
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 12, height: 34 }}
        >
          <Icon name={searching ? 'close' : 'search'} size={15} color={colors.inkSoft} />
          {!searching && (
            <AppText weight="semibold" size={13} color={colors.inkSoft}>
              Search
            </AppText>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={{ margin: 16, backgroundColor: colors.night, borderRadius: 20, padding: 16 }}>
          <AppText weight="semibold" size={12} color="#A9ADB5">
            Breeds caught
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <AppText weight="black" size={34} color={colors.white}>
              {caught.size}
              <AppText weight="semibold" size={18} color="#A9ADB5">
                {' '}
                / {BREEDS.length}
              </AppText>
            </AppText>
            {next && (
              <View style={{ alignItems: 'flex-end', paddingBottom: 6 }}>
                <AppText size={11} color="#A9ADB5">
                  Next badge
                </AppText>
                <AppText weight="bold" size={12} color={colors.yellow}>
                  {next.at} · {next.label}
                </AppText>
              </View>
            )}
          </View>
          <View style={{ height: 8, backgroundColor: colors.nightSoft, borderRadius: 4, marginTop: 10, overflow: 'hidden' }}>
            <View style={{ width: `${Math.max(2, pct * 100)}%`, height: '100%', backgroundColor: colors.yellow, borderRadius: 4 }} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          <Chip label="All groups" active={group === 'all'} onPress={() => setGroup('all')} />
          {GROUP_NAMES.map((g) => (
            <Chip key={g} label={g} active={group === g} onPress={() => setGroup(g)} />
          ))}
        </ScrollView>

        {groups.map((g) => {
          const all = BREEDS.filter((b) => b.group === g);
          const shown = query ? all.filter((b) => b.name.toLowerCase().includes(query)) : all;
          if (!shown.length) return null;
          const have = all.filter((b) => caught.has(b.id)).length;
          return (
            <View key={g} style={{ paddingHorizontal: 16, marginTop: 20 }}>
              <AppText weight="bold" size={16} style={{ marginBottom: 10 }}>
                {g}{' '}
                <AppText size={14} color={colors.muted}>
                  · {have} of {all.length}
                </AppText>
              </AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {shown.map((b) => {
                  const got = caught.has(b.id);
                  // Searching reveals names, so you know what to look for.
                  const label = got || query ? b.name : '???';
                  return (
                    <Pressable
                      key={b.id}
                      disabled={!got}
                      onPress={() => openBreed(b.id)}
                      accessibilityLabel={got ? b.name : `Breed ${b.number}, not caught yet`}
                      style={{
                        width: cell,
                        aspectRatio: 0.72,
                        backgroundColor: got ? colors.white : colors.sand,
                        borderRadius: 14,
                        alignItems: 'center',
                        padding: 6,
                      }}
                    >
                      <AppText size={9} color={colors.muted} style={{ alignSelf: 'flex-start' }}>
                        {formatNumber(b.number)}
                      </AppText>
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <DogArt look={b.look} size={44} silhouette={!got} />
                      </View>
                      <AppText weight={got ? 'semibold' : 'regular'} size={10} color={got ? colors.ink : colors.muted} align="center" numberOfLines={2}>
                        {label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
