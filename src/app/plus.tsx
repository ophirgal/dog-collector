import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Icon } from '@/components/Icon';
import { Button, IconButton } from '@/components/ui';
import { useGame } from '@/state/store';
import { colors, radius } from '@/theme';

const PERKS = ['3 free gems every day', 'Gold collector’s ring on your profile', 'Plus badge next to your name'];

const PACKS = [
  { gems: 5, price: '$0.99' },
  { gems: 15, price: '$2.49', popular: true },
  { gems: 40, price: '$5.99' },
];

export default function Plus() {
  const insets = useSafeAreaInsets();
  const { state, update } = useGame();

  // Store purchases need a development build with an in-app purchase library and
  // App Store / Play products, which don't exist yet. Development builds can fake it.
  const notYet = (what: string, grant: () => void) =>
    Alert.alert(
      'Purchases aren’t live yet',
      `${what} will be available once the app is in the stores.`,
      __DEV__
        ? [
            { text: 'OK', style: 'cancel' },
            { text: 'Grant for testing', onPress: grant },
          ]
        : [{ text: 'OK' }],
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 16, paddingBottom: insets.bottom + 24 }}>
        <IconButton name="close" label="Close" onPress={() => router.back()} />

        <View style={{ backgroundColor: colors.night, borderRadius: 24, padding: 20, marginTop: 14, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: colors.nightSoft, top: -70, right: -60 }} />
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.yellow, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
            <AppText weight="black" size={11}>
              PLUS
            </AppText>
          </View>
          <AppText weight="black" size={28} color={colors.white} style={{ marginTop: 10, lineHeight: 32 }}>
            More gems,{'\n'}more shine.
          </AppText>
          <View style={{ gap: 10, marginTop: 16 }}>
            {PERKS.map((p) => (
              <View key={p} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={13} color={colors.white} strokeWidth={3} />
                </View>
                <AppText size={14} color={colors.white}>
                  {p}
                </AppText>
              </View>
            ))}
          </View>
          <AppText size={12} color="#8B8F98" style={{ marginTop: 14 }}>
            Every breed stays catchable for free. Plus never unlocks dogs.
          </AppText>
          {state.plus ? (
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <AppText weight="bold" size={15} color={colors.yellow}>
                You’re a Plus member
              </AppText>
            </View>
          ) : (
            <Button
              label="Try Plus · $3.99 / month"
              variant="yellow"
              style={{ marginTop: 16 }}
              onPress={() => notYet('Plus', () => update((s) => ({ ...s, plus: true })))}
            />
          )}
        </View>

        <AppText weight="bold" size={17} style={{ marginTop: 26, marginBottom: 12 }}>
          Gem packs
        </AppText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {PACKS.map((p) => (
            <Pressable
              key={p.gems}
              accessibilityRole="button"
              accessibilityLabel={`${p.gems} gems for ${p.price}`}
              onPress={() => notYet(`${p.gems} gems`, () => update((s) => ({ ...s, gems: s.gems + p.gems })))}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colors.white,
                borderRadius: radius.md,
                borderWidth: p.popular ? 2.5 : 1,
                borderColor: p.popular ? colors.green : colors.line,
                alignItems: 'center',
                paddingVertical: 18,
                gap: 4,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              {p.popular && (
                <View style={{ position: 'absolute', top: -11, backgroundColor: colors.green, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <AppText weight="bold" size={11} color={colors.white}>
                    Popular
                  </AppText>
                </View>
              )}
              <Icon name="gem" size={30} color={colors.gem} />
              <AppText weight="black" size={24}>
                {p.gems}
              </AppText>
              <AppText size={13} color={colors.muted}>
                {p.price}
              </AppText>
            </Pressable>
          ))}
        </View>
        <AppText size={12} color={colors.muted} align="center" style={{ marginTop: 18 }}>
          1 gem collects a dog from the feed · the first catch of a new breed is always free
        </AppText>
      </ScrollView>
    </View>
  );
}
