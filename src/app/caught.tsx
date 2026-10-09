import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { BreedPicker } from '@/components/BreedPicker';
import { Icon } from '@/components/Icon';
import { Button, Chip, GemCost, IconButton, RarityTag } from '@/components/ui';
import { formatNumber, getBreed, MIXED_BREED_ID, POPULAR_BREED_IDS } from '@/data/breeds';
import { NAME_IDEAS } from '@/data/community';
import { shortDate } from '@/game/dates';
import { addCatch, canClaim, catchCost } from '@/game/logic';
import { currentPlace } from '@/services/location';
import { keepPhoto } from '@/services/photos';
import { useGame, useToday } from '@/state/store';
import type { Place } from '@/state/types';
import { colors, fonts, radius, shadow } from '@/theme';

export default function Caught() {
  const insets = useSafeAreaInsets();
  const { photo } = useLocalSearchParams<{ photo: string }>();
  const { state, attempt } = useGame();
  const today = useToday();
  const [breedId, setBreedId] = useState<string | null>(null);
  const [name, setName] = useState(() => NAME_IDEAS[Math.floor(Math.random() * NAME_IDEAS.length)]);
  const [editing, setEditing] = useState(false);
  const [picker, setPicker] = useState(false);
  const [place, setPlace] = useState<Place | undefined>();
  const [locating, setLocating] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metAt] = useState(() => Date.now());

  useEffect(() => {
    currentPlace()
      .then(setPlace)
      .finally(() => setLocating(false));
  }, []);

  const breed = breedId ? getBreed(breedId) : null;
  const cost = breedId ? catchCost(state, breedId) : 0;
  // Offer the popular breeds, plus whatever was picked from the full list.
  const chips = useMemo(() => {
    const ids = POPULAR_BREED_IDS.slice(0, 5);
    if (breedId && !ids.includes(breedId) && breedId !== MIXED_BREED_ID) ids.unshift(breedId);
    return [...ids, MIXED_BREED_ID];
  }, [breedId]);

  const add = async () => {
    if (!breedId || saving) return;
    setSaving(true);
    const id = `d-${metAt}`;
    let uri = photo;
    try {
      uri = await keepPhoto(photo, id);
    } catch {
      // Keep the cached photo rather than losing the catch.
    }
    const r = attempt((s) =>
      addCatch(s, { id, name: name.trim() || 'Good dog', breedId, source: 'caught', photoUri: uri, metAt, place }),
    );
    setSaving(false);
    if (!r.ok) {
      Alert.alert(
        'Out of gems',
        `You already have a ${getBreed(breedId).name}, so this catch costs a gem.`,
        [
          { text: 'Not now', style: 'cancel' },
          canClaim(state, today)
            ? { text: 'Claim free gem', onPress: () => router.push('/profile') }
            : { text: 'Get gems', onPress: () => router.push('/plus') },
        ],
      );
      return;
    }
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/dog/${id}`);
  };

  const pill = !breed ? 'WHAT BREED IS IT?' : cost === 0 ? 'NEW BREED · FREE CATCH' : 'REPEAT BREED · 1 GEM';

  return (
    <View style={{ flex: 1, backgroundColor: colors.yellowSoft }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24 }}>
        <View style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 1 }}>
          <IconButton
            name="close"
            label="Discard"
            onPress={() =>
              Alert.alert('Discard this photo?', undefined, [
                { text: 'Keep', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => router.back() },
              ])
            }
          />
        </View>
        <View style={{ alignSelf: 'center', backgroundColor: colors.night, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
          <AppText weight="bold" size={11} color={colors.yellow} style={{ letterSpacing: 0.8 }}>
            {pill}
          </AppText>
        </View>
        <AppText weight="black" size={34} align="center" style={{ marginTop: 8 }}>
          Caught!
        </AppText>

        <View style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, marginTop: 16, transform: [{ rotate: '-1.5deg' }] }, shadow]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, minHeight: 20 }}>
            {breed ? <RarityTag rarity={breed.rarity} /> : <View />}
            {breed && (
              <AppText weight="bold" size={13} color={colors.yellow}>
                {formatNumber(breed.number)}
              </AppText>
            )}
          </View>
          <Image source={{ uri: photo }} style={{ width: '100%', aspectRatio: 1, borderRadius: 14, backgroundColor: colors.sand }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            {editing ? (
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={24}
                onBlur={() => setEditing(false)}
                onSubmitEditing={() => setEditing(false)}
                accessibilityLabel="Dog name"
                style={{ flex: 1, fontFamily: fonts.black, fontSize: 24, color: colors.ink, padding: 0 }}
              />
            ) : (
              <Pressable onPress={() => setEditing(true)} accessibilityRole="button" accessibilityLabel={`Rename ${name}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <AppText weight="black" size={24}>
                  {name}
                </AppText>
                <Icon name="pencil" size={16} color={colors.muted} />
              </Pressable>
            )}
          </View>
          <AppText size={14} color={colors.inkSoft}>
            {breed?.name ?? 'Breed not picked yet'}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <Icon name="pin" size={14} color={colors.red} />
            {locating ? (
              <ActivityIndicator size="small" color={colors.muted} />
            ) : (
              <AppText size={13} color={colors.inkSoft}>
                {place ? `${place.spot}, ${place.neighborhood}` : 'Location off'} · {shortDate(new Date(metAt))}
              </AppText>
            )}
          </View>
        </View>

        <AppText weight="semibold" size={14} color={colors.inkSoft} style={{ marginTop: 22, marginBottom: 10 }}>
          {breed ? `Not a ${breed.name}? Pick the breed` : 'What breed is it?'}
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((id) => (
            <Chip key={id} label={getBreed(id).name} active={breedId === id} onPress={() => setBreedId(id)} />
          ))}
          <Chip label="Other…" onPress={() => setPicker(true)} />
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retake"
          onPress={() => router.replace('/snap')}
          style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line }}
        >
          <Icon name="retake" size={22} />
        </Pressable>
        <Button
          label="Add to my pack"
          style={{ flex: 1 }}
          disabled={!breedId}
          loading={saving}
          onPress={add}
          trailing={cost > 0 ? <GemCost cost={cost} /> : undefined}
        />
      </View>

      <BreedPicker
        visible={picker}
        onClose={() => setPicker(false)}
        onPick={(b) => {
          setBreedId(b.id);
          setPicker(false);
        }}
      />
    </View>
  );
}
