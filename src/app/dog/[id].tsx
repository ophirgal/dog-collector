import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { Icon } from '@/components/Icon';
import { MapCanvas } from '@/components/MapCanvas';
import { Button, IconButton, RarityTag } from '@/components/ui';
import { formatNumber, getBreed } from '@/data/breeds';
import { shortDate } from '@/game/dates';
import { enterTopDog, releaseDog, updateDog } from '@/game/logic';
import { deletePhoto } from '@/services/photos';
import { shareDog } from '@/services/share';
import { useGame, useToday } from '@/state/store';
import { colors, fonts, radius, shadow, tintFor } from '@/theme';

export default function DogDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, update } = useGame();
  const today = useToday();
  const dog = state.dogs.find((d) => d.id === id);
  const [editing, setEditing] = useState(false);

  if (!dog) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <AppText weight="bold" size={18}>
          This dog isn’t in your pack anymore.
        </AppText>
        <Button label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/pack'))} />
      </View>
    );
  }

  const breed = getBreed(dog.breedId);
  const seen = state.dogs.filter((d) => d.breedId === dog.breedId && d.name.toLowerCase() === dog.name.toLowerCase()).length;
  const entered = dog.enteredDay && dog.enteredDay > today;

  const more = () =>
    Alert.alert(dog.name, undefined, [
      {
        text: entered ? 'Entered in tomorrow’s Top Dog' : 'Enter tomorrow’s Top Dog',
        onPress: () => !entered && update((s) => enterTopDog(s, dog.id, today)),
      },
      {
        text: 'Release from pack',
        style: 'destructive',
        onPress: () =>
          Alert.alert(`Release ${dog.name}?`, 'This removes the dog and its photo from your pack. Gems are not refunded.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Release',
              style: 'destructive',
              onPress: () => {
                router.back();
                deletePhoto(dog.photoUri);
                update((s) => releaseDog(s, dog.id));
              },
            },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ height: 360, backgroundColor: tintFor(dog.id), alignItems: 'center', justifyContent: 'flex-end' }}>
          {dog.photoUri ? (
            <Image source={{ uri: dog.photoUri }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
          ) : (
            <DogArt look={breed.look} size={210} />
          )}
        </View>

        <View style={{ padding: 20, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {editing ? (
              <TextInput
                defaultValue={dog.name}
                autoFocus
                maxLength={24}
                onEndEditing={(e) => {
                  const name = e.nativeEvent.text.trim();
                  if (name) update((s) => updateDog(s, dog.id, { name }));
                  setEditing(false);
                }}
                onBlur={() => setEditing(false)}
                style={{ flex: 1, fontFamily: fonts.black, fontSize: 30, color: colors.ink, padding: 0 }}
              />
            ) : (
              <Pressable onPress={() => setEditing(true)} accessibilityRole="button" accessibilityLabel={`Rename ${dog.name}`}>
                <AppText weight="black" size={30}>
                  {dog.name}
                </AppText>
              </Pressable>
            )}
            <RarityTag rarity={breed.rarity} />
          </View>
          <AppText size={15} color={colors.inkSoft}>
            {breed.name} · {dog.source === 'caught' ? 'Caught by you' : `Collected from @${dog.from}`}
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20 }}>
          {[
            [shortDate(new Date(dog.metAt)), dog.source === 'caught' ? 'Met' : 'Collected'],
            [`${seen}×`, 'Seen by you'],
            [formatNumber(breed.number), 'Breed'],
          ].map(([value, label]) => (
            <View key={label} style={[{ flex: 1, backgroundColor: colors.white, borderRadius: 16, paddingVertical: 12, alignItems: 'center' }, shadow, { shadowOpacity: 0.04 }]}>
              <AppText weight="black" size={20}>
                {value}
              </AppText>
              <AppText size={12} color={colors.muted}>
                {label}
              </AppText>
            </View>
          ))}
        </View>

        {dog.place ? (
          <View style={{ margin: 20, marginBottom: 0, backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' }}>
            <MapCanvas
              style={{ height: 130 }}
              center={dog.place}
              pins={[{ id: dog.id, coordinate: dog.place, breedId: dog.breedId, photoUri: dog.photoUri, ring: colors.red, size: 36 }]}
              spanMeters={500}
              interactive={false}
              showsUser={false}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
              <View style={{ flex: 1 }}>
                <AppText weight="bold" size={14}>
                  {dog.place.spot}
                </AppText>
                <AppText size={12} color={colors.muted}>
                  {dog.place.neighborhood} · exact spot only visible to you
                </AppText>
              </View>
              <Icon name="lock" size={16} color={colors.muted} />
            </View>
          </View>
        ) : (
          <View style={{ margin: 20, marginBottom: 0, backgroundColor: colors.white, borderRadius: radius.lg, padding: 14 }}>
            <AppText size={14} color={colors.inkSoft}>
              {dog.source === 'collected'
                ? `Collected from @${dog.from}’s post. Collected dogs don’t count toward your Breed Index.`
                : 'Location was off when you met, so this dog isn’t on your map.'}
            </AppText>
          </View>
        )}

        {entered && (
          <View style={{ marginHorizontal: 20, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.yellowSoft, borderRadius: 14, padding: 12 }}>
            <Icon name="crown" size={18} color={colors.ink} />
            <AppText size={14} weight="semibold">
              Entered in tomorrow’s Top Dog
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, flexDirection: 'row', gap: 10 }}>
        <IconButton name="back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/pack'))} />
        <View style={{ flex: 1 }} />
        <IconButton name="share" label="Share" onPress={() => shareDog(dog)} />
        <IconButton name="more" label="More" onPress={more} />
      </View>

      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 10, paddingBottom: insets.bottom + 12, backgroundColor: colors.cream }}>
        <Button
          label={dog.postedAt ? 'On the feed' : 'Post to feed'}
          variant="light"
          icon={dog.postedAt ? 'check' : undefined}
          disabled={dog.source !== 'caught' || !!dog.postedAt}
          style={{ flex: 1 }}
          onPress={() => update((s) => updateDog(s, dog.id, { postedAt: Date.now() }))}
        />
        <Button label="Send as sticker" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/stickers', params: { dog: dog.id } })} />
      </View>
    </View>
  );
}
