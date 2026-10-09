import type { BottomTabBarProps } from 'expo-router/tabs';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Icon, type IconName } from '@/components/Icon';
import { colors, shadow } from '@/theme';

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'map', label: 'Map', icon: 'map' },
  { name: 'feed', label: 'Feed', icon: 'feed' },
  { name: 'top-dog', label: 'Top Dog', icon: 'crown' },
  { name: 'pack', label: 'My Pack', icon: 'paw' },
];

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;
  const dark = current === 'top-dog';

  const item = (t: (typeof TABS)[number]) => {
    const active = current === t.name;
    const color = active ? (dark ? colors.yellow : colors.green) : dark ? '#8B8F98' : colors.muted;
    return (
      <Pressable
        key={t.name}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={t.label}
        onPress={() => {
          const route = state.routes.find((r) => r.name === t.name);
          if (!route) return;
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!active && !event.defaultPrevented) navigation.navigate(t.name);
        }}
        style={{ flex: 1, alignItems: 'center', gap: 3, paddingTop: 10 }}
      >
        <Icon name={t.icon} size={24} color={color} />
        <AppText weight="semibold" size={11} color={color}>
          {t.label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: dark ? colors.night : colors.white,
        borderTopWidth: 1,
        borderTopColor: dark ? colors.nightSoft : colors.line,
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {item(TABS[0])}
      {item(TABS[1])}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Snap a dog"
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/snap');
          }}
          style={({ pressed }) => [
            {
              width: 66,
              height: 66,
              borderRadius: 33,
              marginTop: -26,
              backgroundColor: colors.green,
              borderWidth: 5,
              borderColor: dark ? colors.night : colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
            shadow,
          ]}
        >
          <Icon name="camera" size={28} color={colors.white} />
        </Pressable>
        <AppText weight="semibold" size={11} color={dark ? colors.yellow : colors.green} style={{ marginTop: 2 }}>
          Snap
        </AppText>
      </View>
      {item(TABS[2])}
      {item(TABS[3])}
    </View>
  );
}
