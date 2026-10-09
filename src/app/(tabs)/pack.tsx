import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { DogPicture } from '@/components/DogPicture';
import { Button, GemPill, Segmented } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { caughtBreedIds } from '@/game/logic';
import { useGame } from '@/state/store';
import type { DogSource } from '@/state/types';
import { colors, tintFor } from '@/theme';

type Tab = 'all' | DogSource;

export default function Pack() {
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const [tab, setTab] = useState<Tab>('all');
  const caught = state.dogs.filter((d) => d.source === 'caught').length;
  const collected = state.dogs.length - caught;
  const dogs = tab === 'all' ? state.dogs : state.dogs.filter((d) => d.source === tab);
  const breeds = caughtBreedIds(state).size;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 12 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <AppText weight="black" size={32}>
            My Pack
          </AppText>
          <AppText size={14} color={colors.inkSoft}>
            {state.dogs.length} dogs · {caught} caught · {collected} collected
          </AppText>
        </View>
        <GemPill />
      </View>
      <Pressable
        onPress={() => router.push('/breeds')}
        accessibilityRole="button"
        style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.night, borderRadius: 14, padding: 12 }}
      >
        <AppText weight="semibold" size={14} color={colors.white} style={{ flex: 1 }}>
          Breed Index
        </AppText>
        <AppText weight="bold" size={14} color={colors.yellow}>
          {breeds} / 120 ›
        </AppText>
      </Pressable>
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: 'All' },
            { value: 'caught', label: 'Caught' },
            { value: 'collected', label: 'Collected' },
          ]}
        />
      </View>
      <FlatList
        data={dogs}
        numColumns={3}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        columnWrapperStyle={{ gap: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 40, gap: 12, paddingHorizontal: 24 }}>
            <DogArt look={getBreed('golden-retriever').look} size={100} silhouette />
            <AppText weight="bold" size={18} align="center">
              {tab === 'collected' ? 'No collected dogs yet' : 'Your pack is empty'}
            </AppText>
            <AppText size={14} color={colors.inkSoft} align="center">
              {tab === 'collected'
                ? 'Collect dogs from the feed for one gem each.'
                : 'Snap the next dog you see on a walk. The first of every breed is free.'}
            </AppText>
            {tab !== 'collected' && <Button label="Snap a dog" icon="camera" onPress={() => router.push('/snap')} />}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/dog/${item.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${getBreed(item.breedId).name}`}
            style={({ pressed }) => ({
              flex: 1 / 3,
              aspectRatio: 0.82,
              borderRadius: 18,
              backgroundColor: tintFor(item.id),
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 14,
                height: 14,
                borderRadius: 7,
                borderWidth: 2,
                borderColor: colors.white,
                backgroundColor: item.source === 'caught' ? colors.green : colors.yellow,
                zIndex: 1,
              }}
            />
            <DogPicture breedId={item.breedId} photoUri={item.photoUri} size={item.photoUri ? 84 : 76} />
            <AppText weight="bold" size={14} numberOfLines={1} style={{ marginTop: 4 }}>
              {item.name}
            </AppText>
          </Pressable>
        )}
      />
    </View>
  );
}
