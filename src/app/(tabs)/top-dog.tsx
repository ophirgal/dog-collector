import * as Haptics from 'expo-haptics';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { CandidateCard } from '@/components/CandidateCard';
import { Icon } from '@/components/Icon';
import { formatDuration, fromDayKey } from '@/game/dates';
import { vote } from '@/game/logic';
import { roundAt, roundSplit, ROUNDS } from '@/game/topDog';
import { useGame, useNow, useToday } from '@/state/store';
import { useTopDogGame } from '@/state/useTopDog';
import { colors, tints } from '@/theme';

export default function TopDog() {
  const insets = useSafeAreaInsets();
  const { update } = useGame();
  const today = useToday();
  const now = useNow(30_000);
  const { game, votes } = useTopDogGame(today);
  const { round, endsInMs } = roundAt(fromDayKey(today), now);
  const [a, b] = game.pairs[round];
  const picked = votes?.[round];
  const split = picked ? roundSplit(game, round, votes) : undefined;

  const focused = useIsFocused();

  const pick = (id: string) => {
    if (picked) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    update((s) => vote(s, today, round, id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.night, paddingTop: insets.top + 12 }}>
      {focused && <StatusBar style="light" />}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="crown" size={26} color={colors.yellow} />
            <AppText weight="black" size={28} color={colors.white}>
              Top Dog
            </AppText>
          </View>
          <AppText size={13} color="#A9ADB5">
            Today’s theme: {game.theme.title}
          </AppText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <AppText weight="bold" size={15} color={colors.yellow}>
            Round {round + 1} / {ROUNDS}
          </AppText>
          <AppText size={12} color="#A9ADB5">
            ends in {formatDuration(endsInMs)}
          </AppText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, marginTop: 16 }}>
        {game.pairs.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i === round ? colors.yellow : i < round ? (votes?.[i] ? '#B8902C' : '#5A5E68') : colors.nightSoft,
            }}
          />
        ))}
      </View>

      <AppText weight="bold" size={19} color={colors.white} align="center" style={{ marginTop: 18, marginBottom: 12 }}>
        {game.theme.question}
      </AppText>

      <View style={{ flex: 1, paddingHorizontal: 16, gap: 10 }}>
        <CandidateCard
          candidate={game.candidates[a]}
          tint={tints[0]}
          chosen={picked === game.candidates[a].id}
          percent={split?.[0]}
          disabled={!!picked}
          onPress={() => pick(game.candidates[a].id)}
        />
        <CandidateCard
          candidate={game.candidates[b]}
          tint={tints[2]}
          chosen={picked === game.candidates[b].id}
          percent={split?.[1]}
          disabled={!!picked}
          onPress={() => pick(game.candidates[b].id)}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '50%',
            marginTop: -22,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.yellow,
            borderWidth: 3,
            borderColor: colors.night,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText weight="black" size={14}>
            VS
          </AppText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
        <AppText size={12} color="#A9ADB5" style={{ flex: 1 }}>
          {picked
            ? round + 1 < ROUNDS
              ? `Voted. Round ${round + 2} opens in ${formatDuration(endsInMs)}.`
              : `Voted. Tomorrow’s game starts in ${formatDuration(endsInMs)}.`
            : 'Tap a dog to vote · 6 dogs, 5 rounds, 1 crown'}
        </AppText>
        <Pressable
          onPress={() => router.push('/winner')}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.nightSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}
        >
          <Icon name="crown" size={14} color={colors.yellow} />
          <AppText weight="semibold" size={13} color={colors.white}>
            Yesterday’s winner
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
