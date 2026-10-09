import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { DogArt } from '@/components/DogArt';
import { Icon } from '@/components/Icon';
import { GemCost, GemPill, RarityTag } from '@/components/ui';
import { getBreed } from '@/data/breeds';
import { COMMUNITY_DOGS, type CommunityDog } from '@/data/community';
import { timeAgo } from '@/game/dates';
import { canClaim, collect, COLLECT_COST, enterTopDog, hasCollected, toggleFollow, toggleLike } from '@/game/logic';
import { useGame, useNow, useToday } from '@/state/store';
import type { Dog } from '@/state/types';
import { colors, tintFor } from '@/theme';

type Tab = 'following' | 'nearby' | 'world';

type Post =
  | { kind: 'community'; id: string; ageMs: number; dog: CommunityDog }
  | { kind: 'mine'; id: string; ageMs: number; dog: Dog };

export default function Feed() {
  const insets = useSafeAreaInsets();
  const { state, update, attempt } = useGame();
  const now = useNow(60_000);
  const today = useToday();
  const [tab, setTab] = useState<Tab>('following');

  const posts = useMemo(() => {
    const mine: Post[] = state.dogs
      .filter((d) => d.postedAt)
      .map((d) => ({ kind: 'mine', id: `p-${d.id}`, ageMs: now - d.postedAt!, dog: d }));
    const others: Post[] = COMMUNITY_DOGS.filter((d) =>
      tab === 'following' ? state.following.includes(d.owner) : tab === 'nearby' ? d.nearby : true,
    ).map((d) => ({ kind: 'community', id: `p-${d.id}`, ageMs: d.hoursAgo * 3_600_000, dog: d }));
    return [...mine, ...others].sort((a, b) => a.ageMs - b.ageMs);
  }, [state.dogs, state.following, tab, now]);

  const onCollect = (d: CommunityDog) => {
    const r = attempt((s) => collect(s, d));
    if (!r.ok && r.reason === 'no-gems') {
      Alert.alert('Out of gems', 'Collecting a dog from the feed costs one gem.', [
        { text: 'Not now', style: 'cancel' },
        canClaim(state, today)
          ? { text: 'Claim free gem', onPress: () => router.push('/profile') }
          : { text: 'Get gems', onPress: () => router.push('/plus') },
      ]);
    }
  };

  const renderPost = ({ item }: { item: Post }) => {
    const mine = item.kind === 'mine';
    const breed = getBreed(item.dog.breedId);
    const owner = mine ? state.username! : item.dog.owner;
    const where = mine
      ? state.privacy === 'neighborhood' && item.dog.place
        ? ` in ${item.dog.place.neighborhood}`
        : ''
      : ` in ${item.dog.neighborhood}`;
    const liked = state.liked.includes(item.id);
    const likes = (mine ? 0 : item.dog.likes) + (liked ? 1 : 0);
    const following = !mine && state.following.includes(owner);

    return (
      <View style={{ backgroundColor: colors.white, borderRadius: 20, marginHorizontal: 12, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: colors.red, alignItems: 'center', justifyContent: 'center', backgroundColor: tintFor(owner) }}>
            <AppText weight="bold" size={14}>
              {owner[0].toUpperCase()}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="bold" size={14}>
              {mine ? `${owner} (you)` : owner}
            </AppText>
            <AppText size={12} color={colors.muted}>
              {timeAgo(item.ageMs)} ago{where}
            </AppText>
          </View>
          {!mine && (
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Options for ${owner}`}
              onPress={() =>
                Alert.alert(`@${owner}`, undefined, [
                  { text: following ? 'Unfollow' : 'Follow', onPress: () => update((s) => toggleFollow(s, owner)) },
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <Icon name="more" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
        <View style={{ aspectRatio: 1.05, backgroundColor: tintFor(item.dog.name), alignItems: 'center', justifyContent: 'center' }}>
          {mine && item.dog.photoUri ? (
            <Image source={{ uri: item.dog.photoUri }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <DogArt look={breed.look} size={170} />
          )}
          <View style={{ position: 'absolute', left: 12, bottom: 12 }}>
            <RarityTag rarity={breed.rarity} />
          </View>
        </View>
        <View style={{ padding: 12, gap: 2 }}>
          <AppText weight="black" size={18}>
            {item.dog.name}
          </AppText>
          <AppText size={13} color={colors.inkSoft}>
            {breed.name}
            {!mine ? ` · “${item.dog.caption}”` : ''}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={liked ? 'Remove vote' : 'Vote'}
              onPress={() => update((s) => toggleLike(s, item.id))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Icon name={liked ? 'heart-filled' : 'heart'} size={20} color={colors.red} />
              <AppText weight="semibold" size={13} color={colors.inkSoft}>
                {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
              </AppText>
            </Pressable>
            {mine ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => update((s) => enterTopDog(s, item.dog.id, today))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <Icon name="crown" size={18} color={colors.yellow} />
                <AppText weight="semibold" size={13} color={colors.inkSoft}>
                  {item.dog.enteredDay && item.dog.enteredDay > today ? 'Entered for tomorrow' : 'Enter Top Dog'}
                </AppText>
              </Pressable>
            ) : null}
            <View style={{ flex: 1 }} />
            {!mine &&
              (hasCollected(state, item.dog.id) ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="check" size={16} color={colors.green} />
                  <AppText weight="semibold" size={13} color={colors.green}>
                    In your pack
                  </AppText>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Collect ${item.dog.name} for ${COLLECT_COST} gem`}
                  onPress={() => onCollect(item.dog)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.green, borderRadius: 12, paddingHorizontal: 12, height: 36 }}
                >
                  <AppText weight="bold" size={14} color={colors.white}>
                    Collect
                  </AppText>
                  <GemCost cost={COLLECT_COST} />
                </Pressable>
              ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: insets.top + 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
        <AppText weight="black" size={32} style={{ flex: 1 }}>
          Feed
        </AppText>
        <GemPill />
      </View>
      <View style={{ flexDirection: 'row', gap: 20, paddingHorizontal: 16, marginTop: 10, marginBottom: 12 }}>
        {(['following', 'nearby', 'world'] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <AppText weight={tab === t ? 'bold' : 'medium'} size={15} color={tab === t ? colors.green : colors.inkSoft} style={{ textTransform: 'capitalize' }}>
              {t}
            </AppText>
            {tab === t && <View style={{ height: 3, backgroundColor: colors.green, borderRadius: 2, marginTop: 4 }} />}
          </Pressable>
        ))}
      </View>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={renderPost}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <AppText size={14} color={colors.inkSoft} align="center" style={{ padding: 24 }}>
            Follow collectors from the World tab to fill this feed.
          </AppText>
        }
      />
    </View>
  );
}
