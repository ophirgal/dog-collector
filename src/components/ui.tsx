import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/AppText';
import { Icon, type IconName } from '@/components/Icon';
import type { Rarity } from '@/data/breeds';
import { useGame } from '@/state/store';
import { colors, radius, shadow } from '@/theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'green' | 'yellow' | 'dark' | 'light' | 'outline';
  icon?: IconName;
  trailing?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BUTTON = {
  green: { bg: colors.green, fg: colors.white },
  yellow: { bg: colors.yellow, fg: colors.ink },
  dark: { bg: colors.night, fg: colors.white },
  light: { bg: colors.white, fg: colors.ink },
  outline: { bg: 'transparent', fg: colors.ink },
};

export function Button({ label, onPress, variant = 'green', icon, trailing, disabled, loading, style }: ButtonProps) {
  const c = BUTTON[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 54,
          borderRadius: radius.md,
          backgroundColor: c.bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 18,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          borderWidth: variant === 'outline' || variant === 'light' ? 1 : 0,
          borderColor: colors.line,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.fg} />
      ) : (
        <>
          {icon && <Icon name={icon} size={18} color={c.fg} />}
          <AppText weight="bold" size={16} color={c.fg}>
            {label}
          </AppText>
          {trailing}
        </>
      )}
    </Pressable>
  );
}

/** "· 💎 1" suffix for buttons that spend gems. */
export function GemCost({ cost, color = colors.white }: { cost: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <AppText weight="bold" size={16} color={color}>
        ·
      </AppText>
      <Icon name="gem" size={15} color={colors.gem} />
      <AppText weight="bold" size={16} color={color}>
        {cost}
      </AppText>
    </View>
  );
}

export function GemPill({ dark }: { dark?: boolean }) {
  const { state } = useGame();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${state.gems} gems. Get more gems`}
      onPress={() => router.push('/plus')}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 14,
          height: 38,
          borderRadius: radius.pill,
          backgroundColor: dark ? colors.nightSoft : colors.white,
        },
        shadow,
      ]}
    >
      <Icon name="gem" size={18} color={colors.gem} />
      <AppText weight="bold" size={16} color={dark ? colors.white : colors.ink}>
        {state.gems}
      </AppText>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  dark,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        height: 36,
        borderRadius: radius.pill,
        justifyContent: 'center',
        backgroundColor: active ? colors.night : colors.white,
        borderWidth: active ? 0 : 1,
        borderColor: dark ? 'transparent' : colors.line,
      }}
    >
      <AppText weight="semibold" size={14} color={active ? colors.white : colors.inkSoft}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.sand, borderRadius: 14, padding: 4 }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[
              { flex: 1, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
              active && { backgroundColor: colors.white, ...shadow, shadowOpacity: 0.05 },
            ]}
          >
            <AppText weight={active ? 'bold' : 'semibold'} size={15} color={active ? colors.ink : colors.inkSoft}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const RARITY = {
  common: { bg: '#E7EFE9', fg: colors.green },
  uncommon: { bg: '#E3F0E9', fg: '#2E8A63' },
  rare: { bg: '#EFE6FB', fg: '#7A4CC2' },
};

export function RarityTag({ rarity }: { rarity: Rarity }) {
  const c = RARITY[rarity];
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' }}>
      <AppText weight="bold" size={10} color={c.fg} style={{ letterSpacing: 1 }}>
        {rarity.toUpperCase()}
      </AppText>
    </View>
  );
}

export function IconButton({
  name,
  onPress,
  label,
  dark,
  size = 40,
}: {
  name: IconName;
  onPress: () => void;
  label: string;
  dark?: boolean;
  size?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon name={name} size={size * 0.5} color={dark ? colors.white : colors.ink} />
    </Pressable>
  );
}
