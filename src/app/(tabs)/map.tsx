import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { DogBubble } from '@/components/DogPicture';
import { Icon } from '@/components/Icon';
import { MapCanvas } from '@/components/MapCanvas';
import type { MapArea, MapPin } from '@/components/mapTypes';
import { Chip, GemPill } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { COMMUNITY_DOGS } from '@/data/community';
import { dayKey, fromDayKey, timeAgo } from '@/game/dates';
import { caughtBreedIds } from '@/game/logic';
import { hashString } from '@/game/random';
import { distanceM, formatDistance, hotspotsNear, offset, sightingsNear, type LatLng } from '@/game/sightings';
import { roundAt, ROUNDS } from '@/game/topDog';
import { FALLBACK_CENTER, useUserLocation } from '@/services/location';
import { useGame, useNow } from '@/state/store';
import { colors, radius, shadow } from '@/theme';

type Filter = 'recent' | 'hotspots' | 'mine' | 'friends';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'recent', label: 'Recent sightings' },
  { value: 'hotspots', label: 'Hotspots' },
  { value: 'mine', label: 'My catches' },
  { value: 'friends', label: 'Friends' },
];

const ago = (min: number) => (min < 60 ? `${min} min` : `${Math.round(min / 60)}h`);

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { state } = useGame();
  const now = useNow(60_000);
  const { coords, denied } = useUserLocation();
  const center = coords ?? FALLBACK_CENTER;
  const [filter, setFilter] = useState<Filter>('recent');
  const [selected, setSelected] = useState<string | null>(null);
  const [focus, setFocus] = useState<LatLng | null>(null);

  const caught = useMemo(() => caughtBreedIds(state), [state]);
  const sightings = useMemo(() => sightingsNear(center, now), [center, now]);
  const hotspots = useMemo(() => hotspotsNear(center), [center]);
  const myDogs = state.dogs.filter((d) => d.source === 'caught' && d.place);
  // Friends only ever share a neighborhood, so place them loosely around you.
  const friends = useMemo(
    () =>
      COMMUNITY_DOGS.filter((d) => state.following.includes(d.owner)).map((d) => {
        const h = hashString(d.id);
        const angle = ((h % 360) * Math.PI) / 180;
        const dist = 250 + (h % 450);
        return { dog: d, ...offset(center, Math.sin(angle) * dist, Math.cos(angle) * dist) };
      }),
    [state.following, center],
  );

  let pins: MapPin[] = [];
  let areas: MapArea[] = [];
  if (filter === 'recent') {
    pins = sightings.map((s) => ({
      id: s.id,
      coordinate: s,
      breedId: s.dog.breedId,
      ring: caught.has(s.dog.breedId) ? colors.green : colors.yellow,
      faded: s.minutesAgo > 90,
      label: ago(s.minutesAgo),
    }));
  } else if (filter === 'mine') {
    pins = myDogs.map((d) => ({
      id: d.id,
      coordinate: d.place!,
      breedId: d.breedId,
      photoUri: d.photoUri,
      ring: colors.green,
      label: `${d.name} · ${timeAgo(now - d.metAt)}`,
    }));
  } else if (filter === 'friends') {
    pins = friends.map((f) => ({ id: f.dog.id, coordinate: f, breedId: f.dog.breedId, ring: colors.gem, label: `@${f.dog.owner}` }));
    areas = friends.map((f) => ({ id: `a-${f.dog.id}`, center: f, radius: 160, color: 'rgba(59,155,234,0.10)' }));
  } else {
    areas = hotspots.map((h) => ({ id: h.id, center: h, radius: h.radius, color: 'rgba(255,198,61,0.35)' }));
  }

  const nearest = sightings.find((s) => s.id === selected) ?? sightings[0];
  const dayStart = fromDayKey(dayKey(new Date(now)));
  const { round } = roundAt(dayStart, now);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <MapCanvas
        style={{ flex: 1 }}
        center={center}
        pins={pins}
        areas={areas}
        focus={focus}
        onPinPress={(id) => {
          if (filter === 'recent') setSelected(id);
          else if (filter === 'mine') router.push(`/dog/${id}`);
        }}
      />

      <View style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0 }} pointerEvents="box-none">
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }} pointerEvents="box-none">
          <Pressable accessibilityRole="button" accessibilityLabel="Your profile" onPress={() => router.push('/profile')}>
            <DogBubble breedId={state.dogs[0]?.breedId ?? 'pembroke-welsh-corgi'} photoUri={state.dogs[0]?.photoUri} size={50} ring={colors.yellow} />
          </Pressable>
          <GemPill />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}>
          {FILTERS.map((f) => (
            <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => setFilter(f.value)} />
          ))}
        </ScrollView>
        <Pressable
          onPress={() => router.navigate('/top-dog')}
          accessibilityRole="button"
          accessibilityLabel={`Top Dog live, round ${round + 1} of ${ROUNDS}`}
          style={{
            alignSelf: 'flex-end',
            marginRight: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: colors.night,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Icon name="crown" size={22} color={colors.yellow} />
          <View>
            <AppText weight="semibold" size={13} color={colors.white}>
              Top Dog live
            </AppText>
            <AppText weight="bold" size={13} color={colors.yellow}>
              Round {round + 1} of {ROUNDS}
            </AppText>
          </View>
        </Pressable>
      </View>

      <View style={{ position: 'absolute', left: 14, right: 14, bottom: 14, gap: 8 }}>
        {denied && (
          <View style={{ backgroundColor: colors.yellowSoft, borderRadius: 12, padding: 10 }}>
            <AppText size={13} color={colors.ink}>
              Location is off, so this is a sample area. Turn it on in Settings to see dogs near you.
            </AppText>
          </View>
        )}
        <View style={[{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }, shadow]}>
          {filter === 'recent' && nearest ? (
            <>
              <DogArt look={getBreed(nearest.dog.breedId).look} size={52} />
              <View style={{ flex: 1 }}>
                <AppText weight="bold" size={16}>
                  {getBreed(nearest.dog.breedId).name} seen {ago(nearest.minutesAgo)} ago
                </AppText>
                <AppText size={13} color={colors.inkSoft}>
                  {formatDistance(distanceM(center, nearest))} away
                  {caught.has(nearest.dog.breedId) ? '' : ' · '}
                  {!caught.has(nearest.dog.breedId) && (
                    <AppText weight="semibold" size={13} color={colors.green}>
                      new breed for you
                    </AppText>
                  )}
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show on map"
                onPress={() => setFocus({ latitude: nearest.latitude, longitude: nearest.longitude })}
                style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="navigate" size={20} color={colors.green} />
              </Pressable>
            </>
          ) : (
            <View style={{ flex: 1 }}>
              <AppText weight="bold" size={16}>
                {filter === 'mine'
                  ? myDogs.length
                    ? `${myDogs.length} dogs pinned where you met them`
                    : 'No catches on the map yet'
                  : filter === 'friends'
                    ? `${friends.length} dogs from friends nearby`
                    : `${hotspots.length} hotspots near you`}
              </AppText>
              <AppText size={13} color={colors.inkSoft}>
                {filter === 'mine'
                  ? 'Only you can see these exact spots.'
                  : filter === 'friends'
                    ? 'Friends only share the neighborhood, never the exact spot.'
                    : `The busiest one has had ${Math.max(...hotspots.map((h) => h.count))} dogs today.`}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
