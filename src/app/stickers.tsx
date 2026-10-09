import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogBubble } from '@/components/DogPicture';
import { Icon } from '@/components/Icon';
import { Button, IconButton } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { shareDog } from '@/services/share';
import { useGame } from '@/state/store';
import { colors } from '@/theme';

export default function Stickers() {
  const insets = useSafeAreaInsets();
  const { dog: initial } = useLocalSearchParams<{ dog?: string }>();
  const { state } = useGame();
  const [selected, setSelected] = useState(initial ?? state.dogs[0]?.id);
  const dog = state.dogs.find((d) => d.id === selected);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
        <AppText weight="black" size={26} style={{ flex: 1 }}>
          Stickers
        </AppText>
        <IconButton name="close" label="Close" onPress={() => router.back()} />
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 12, gap: 10 }}>
        {dog ? (
          <>
            <View style={{ transform: [{ rotate: '-4deg' }] }}>
              <DogBubble breedId={dog.breedId} photoUri={dog.photoUri} size={170} ring={colors.white} />
            </View>
            <AppText weight="bold" size={17}>
              {dog.name}
            </AppText>
            <AppText size={13} color={colors.muted}>
              {getBreed(dog.breedId).name}
            </AppText>
          </>
        ) : (
          <AppText size={15} color={colors.inkSoft} style={{ padding: 24 }} align="center">
            Every dog you catch becomes a sticker you can send to friends.
          </AppText>
        )}
      </View>

      <View style={{ flex: 1, backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 8 }}>
          <View style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="paw" size={14} color={colors.white} />
          </View>
          <AppText weight="bold" size={15} style={{ flex: 1 }}>
            Dog Collector
          </AppText>
          <AppText size={13} color={colors.muted}>
            {state.dogs.length} stickers
          </AppText>
        </View>
        <FlatList
          data={state.dogs}
          numColumns={4}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelected(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name} sticker`}
              style={{ width: '25%', alignItems: 'center', paddingVertical: 8, opacity: item.id === selected ? 1 : 0.85 }}
            >
              <DogBubble breedId={item.breedId} photoUri={item.photoUri} size={64} ring={item.id === selected ? colors.green : colors.cream} />
            </Pressable>
          )}
        />
        <View style={{ padding: 16, paddingBottom: insets.bottom + 12 }}>
          <Button label="Send sticker" icon="share" disabled={!dog} onPress={() => dog && shareDog(dog)} />
        </View>
      </View>
    </View>
  );
}
